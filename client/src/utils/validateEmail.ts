export interface EmailValidationResult {
  valid: boolean;
  error?: string;
}

export const validateEmail = (email: string) => {
  const positionAt = email.indexOf("@");
  const afterAt = email.split("@")[1];
  const beforeDot = afterAt.split(".")[0];
  const afterLastDot = afterAt.split(".").pop();

  if (positionAt < 1) {
    // si la position du @ est inférieur à 1
    return { valid: false, error: "Au moins 1 caractère avant le @" };
  }
  if (email.split("@").length !== 2) {
    // s'il y a 2 @
    return { valid: false, error: "Qu'un seul @ est autorisé" };
  }
  // ce qu'il y a après le @ (AfterAt) et avant le . (beforeDot)
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
