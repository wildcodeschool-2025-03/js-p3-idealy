import fs from "node:fs";
import path from "node:path";
import type { RequestHandler } from "express";
import formidable from "formidable";
import jwt from "jsonwebtoken";
import serviceRepository from "../service/serviceRepository";
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
    // Fetch all items
    const users = await userRepository.readAll();

    // Respond with the items in JSON format
    res.json(users);
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
    // Extract the item data from the request body
    const newUser = {
      id: Number(req.params.id),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      mail: req.body.mail,
      password: req.body.password,
      picture: req.body.picture,
      isAdmin: req.body.isAdmin,
      service_id: req.body.service_id,
    };

    // Create the service
    const insertId = await userRepository.create(newUser);

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
    // Delete a specific service based on the provided ID
    const userId = Number(req.params.id);

    await userRepository.delete(userId);

    // Respond with HTTP 204 (No Content) anyway
    res.sendStatus(204);
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
      userToUpdate.password = password;
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

const editFirstname: RequestHandler = async (req, res, next) => {
  try {
    // Update a specific category based on the provided ID
    const user = {
      id: Number(req.params.id),
      firstname: req.body.firstname,
    };

    const affectedRows = await userRepository.updateFirstname(user);

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

const editLastname: RequestHandler = async (req, res, next) => {
  try {
    // Update a specific category based on the provided ID
    const user = {
      id: Number(req.params.id),
      lastname: req.body.lastname,
    };

    const affectedRows = await userRepository.updateLastname(user);

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

const editMail: RequestHandler = async (req, res, next) => {
  try {
    // Update a specific category based on the provided ID
    const user = {
      id: Number(req.params.id),
      mail: req.body.mail,
    };

    const affectedRows = await userRepository.updateMail(user);

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

const editPassword: RequestHandler = async (req, res, next) => {
  try {
    // Update a specific category based on the provided ID
    const user = {
      id: Number(req.params.id),
      password: req.body.password,
    };

    const affectedRows = await userRepository.updatePassword(user);

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

    // Authenticate the user
    const user = await userRepository.authenticate(mail, password);
    if (!user) {
      // If authentication fails, respond with HTTP 401 (Unauthorized)
      res.sendStatus(401);
    } else {
      // If authentication succeeds, respond with the user data
      // Supprime le champ password avant d'envoyer l'utilisateur
      const { password, ...userWithoutPassword } = user;

      // Génère un token JWT pour l'utilisateur
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        res.status(500).json({ error: "JWT secret not configured" });
        return;
      }
      // Ici, jwtSecret est forcément string
      const token = jwt.sign(
        { id: userWithoutPassword.id, isAdmin: userWithoutPassword.isAdmin },
        jwtSecret as string,
        { expiresIn: "24h" },
      );
      res.json({ user: userWithoutPassword, token });
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
  editFirstname,
  editLastname,
  editMail,
  editPassword,
  editPicture,
  editService,
  getServiceOfThisUser,
  login,
};
