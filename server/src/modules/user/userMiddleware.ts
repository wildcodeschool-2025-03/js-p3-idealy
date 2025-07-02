import type { RequestHandler } from "express";

const validate: RequestHandler = (req, res, next) => {
  type ValidationError = {
    field: string;
    message: string;
  };

  const errors: ValidationError[] = [];

  const { firstname, lastname, mail, password, service_id } = req.body;

  // Vérif que les champs requis sont présents et du type attendu
  if (!firstname || typeof firstname !== "string" || firstname.trim() === "") {
    errors.push({ field: "firstname", message: "Le prénom est requis." });
  }
  if (!lastname || typeof lastname !== "string" || lastname.trim() === "") {
    errors.push({ field: "lastname", message: "Le nom est requis." });
  }

  // Idem avec le mail + regex
  if (
    !mail ||
    typeof mail !== "string" ||
    !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(mail)
  ) {
    errors.push({ field: "mail", message: "Email invalide." });
  }

  // Idem mot de passe + au moins 6 caractères
  if (!password || typeof password !== "string" || password.length < 6) {
    errors.push({
      field: "password",
      message: "Le mot de passe doit faire au moins 6 caractères.",
    });
  }
  if (
    service_id === undefined ||
    service_id === null ||
    Number.isNaN(Number(service_id))
  ) {
    errors.push({
      field: "service_id",
      message: "Le service est requis.",
    });
  }

  if (errors.length === 0) {
    next();
  } else {
    res.status(400).json({ validationErrors: errors });
  }
};

// Export them to import them somewhere else

export default { validate };
