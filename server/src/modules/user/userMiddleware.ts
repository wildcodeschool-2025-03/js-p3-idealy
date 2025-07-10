import type { RequestHandler } from "express";

const validate: RequestHandler = (req, res, next) => {
  type ValidationError = {
    field: string;
    message: string;
  };

  const errors: ValidationError[] = [];

  const { firstname, lastname, mail, password, service_id } = req.body;

  // Idem avec le mail + regex
  if (
    !mail ||
    typeof mail !== "string" ||
    !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(mail)
  ) {
    errors.push({ field: "mail", message: "Email invalide." });
  }

  // Idem mot de passe + au moins 3 caractères
  if (!password || typeof password !== "string" || password.length < 3) {
    errors.push({
      field: "password",
      message: "Le mot de passe doit faire au moins 3 caractères.",
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
