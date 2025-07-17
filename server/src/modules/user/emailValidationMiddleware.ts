import type { RequestHandler } from "express";

const validateEmailFormat = (email: string) => {
  const positionAt = email.indexOf("@"); // recuperation des infos sur l'email
  const afterAt = email.split("@")[1];
  const beforeDot = afterAt.split(".")[0];
  const afterLastDot = afterAt.split(".").pop();

  if (positionAt === -1) {
    // si pas de @ du tout
    return { valid: false, error: "Il faut un @ dans l'email" };
  }

  if (positionAt < 1) {
    return { valid: false, error: "Au moins 1 caractère avant le @" };
  }

  if (email.split("@").length !== 2) {
    // s'il y a 2 @
    return { valid: false, error: "Qu'un seul @ est autorisé" };
  }

  if (beforeDot.length < 2) {
    return { valid: false, error: "Minimum 2 caractères après le @" };
  }
  if (!afterAt.includes(".")) {
    //
    return { valid: false, error: "Il faut un . après le @" };
  }
  if (!afterLastDot || afterLastDot.length < 2) {
    return {
      valid: false,
      error: "Minimum 2 caractères après le dernier point",
    };
  }
  return { valid: true };
};

const validateEmailUpdate: RequestHandler = (req, res, next) => {
  const { mail } = req.body; // Récupère l'email envoyé par le front

  // Vérifie que l'email existe
  if (!mail || typeof mail !== "string") {
    res.status(400).json({
      validationErrors: [{ field: "mail", message: "Email requis" }],
    });
    return;
  }

  const validation = validateEmailFormat(mail);

  if (!validation.valid) {
    res.status(400).json({
      validationErrors: [{ field: "mail", message: validation.error }],
    });
    return;
  }

  next();
};

export default { validateEmailUpdate };
