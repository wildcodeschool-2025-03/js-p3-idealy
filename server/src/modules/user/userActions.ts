import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import formidable from "formidable";
import jwt from "jsonwebtoken";
// Import access to data
import userRepository from "./userRepository";

interface UserUpdateData {
  id: number;
  firstname: string;
  lastname: string;
  mail: string;
  picture?: string;
  service_id: number;
  password?: string;
}

const uploadDir = path.join(__dirname, "../../../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all items excluding admins
    const users = await userRepository.readAll();
    const filteredUsers = users.filter((user) => !user.isAdmin);

    // Respond with the items in JSON format
    res.json(filteredUsers);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific item based on the provided ID
    const userId = Number(req.params.id);
    const user = await userRepository.read(userId);

    // If the item is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the item in JSON format
    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    const { mail, password } = req.body;
    console.log("Données reçues:", req.body);
    console.log("service_id:", req.body.service_id);
    // Check if email already exists
    const emailExists = await userRepository.emailExists(mail);
    if (emailExists) {
      res.status(409).json({ error: "Cette adresse email est déjà utilisée" });
      return;
    }

    const passHash = bcrypt.hashSync(password, 10);

    const newUserHash = {
      id: Number(req.params.id),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      mail: req.body.mail,
      passHash: passHash,
      picture: req.body.picture,
      isAdmin: req.body.isAdmin,
      service_id: req.body.service_id,
    };

    // Create the user
    const insertId = await userRepository.create(newUserHash);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted item
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The D of BREAD - Delete operation
const destroy: RequestHandler = async (req, res, next) => {
  try {
    console.log("req.user", req.user); // Ajoute ceci
    // Delete a specific service based on the provided ID
    const userId = Number(req.params.id);

    if (req.user?.isAdmin || req.user?.id === userId) {
      await userRepository.delete(userId);

      // Respond with HTTP 204 (No Content) anyway
      res.sendStatus(204);
    } else {
      res.status(403).json({ error: "Non autorisé" });
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const update: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id); // convertit l'ID en nombre
    const { firstname, lastname, mail, service_id, password } = req.body; // evite les répétitions : req.body.firstname etc...

    const userToUpdate: UserUpdateData = {
      id: userId,
      firstname,
      lastname,
      mail,
      service_id, // Utilisation directe de l'ID recu
    };

    // vérifie que le mot de passe n'est pas vide + enlève les espaces puis test la longueur du mdp
    if (password && password.trim().length > 0) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      userToUpdate.password = hashedPassword;
    }

    const affectedRows = await userRepository.update(userToUpdate); // retourne le nombre de lignes modifiées

    // si 0 modification = pas d'utilisateur trouvé
    if (affectedRows === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const updatedUser = await userRepository.read(userId); // relis la base de données avec les modifications
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// The E of BREAD - Edit operation
const editPicture: RequestHandler = (req, res, next) => {
  const form = formidable({
    uploadDir, // sauvegarde les fichiers dans /uploads/
    keepExtensions: true, // garde les extensions dans les noms de fichier
    maxFileSize: 5 * 1024 * 1024,
  });

  // Décode la requête FormData et sépare le contenu :
  // - fields = données texte (nom, email...)
  // - files = fichiers uploadés
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Erreur serveur" });
    }
    try {
      const userId = Number(req.params.id); // transforme ex : "4" en 4

      // Récuperation directe du fichier sans fonction getFile
      const uploadedFile = files.picture;
      const file = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;

      if (file) {
        const filename = path.basename(file.filepath); // extrait le nom ex: filename = test.jpg

        await userRepository.updatePicture({
          id: userId,
          picture: `/uploads/${filename}?v=${Date.now()}`,
        });
      }
      res.sendStatus(204);
    } catch (err) {
      // Pass any errors to the error-handling middleware
      next(err);
    }
  });
};

const editService: RequestHandler = async (req, res, next) => {
  try {
    // Update a specific category based on the provided ID
    const user = {
      id: Number(req.params.id),
      service_id: req.body.service_id,
    };

    const affectedRows = await userRepository.updateService(user);

    // If the category is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the category in JSON format
    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const getServiceOfThisUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const service = await userRepository.getServiceOfThisUser(userId);
    if (service == null) {
      res.sendStatus(404);
    } else {
      res.json(service);
    }
  } catch (err) {
    next(err);
  }
};

const login: RequestHandler = async (req, res, next) => {
  try {
    // Extract the login credentials from the request body
    const { mail, password } = req.body;

    const userHash = await userRepository.signIn(mail);

    // Authenticate the user
    if (!userHash) {
      // If authentication fails, respond with HTTP 401 (Unauthorized)
      res.status(401).json({ message: "Utilisateur inexistant" });
    } else {
      // If authentication succeeds, respond with the user data
      // Supprime le champ password avant d'envoyer l'utilisateur
      const isPasswordValid = bcrypt.compareSync(
        password,
        userHash.password || "",
      );

      console.log(
        "isPasswordValid",
        isPasswordValid,
        password,
        userHash.password,
      );

      // Si le mot de passe est incorrect, renvoyer une erreur 401
      if (!isPasswordValid) {
        res.status(401).json({ message: "Mot de passe incorrect" });
        return;
      }

      // Génère un token JWT pour l'utilisateur
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        res.status(500).json({ error: "JWT secret not configured" });
        return;
      }
      // Ici, jwtSecret est forcément string
      const token = jwt.sign(
        { id: userHash.id, isAdmin: userHash.isAdmin },
        jwtSecret as string,
        { expiresIn: "24h" },
      );
      res.json({ user: userHash, token });
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware

    next(err);
  }
};

export default {
  browse,
  read,
  destroy,
  update,
  add,
  editPicture,
  editService,
  getServiceOfThisUser,
  login,
};
