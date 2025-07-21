// client/src/utils/isTokenExpired.ts

export const isTokenExpired = (token: string): boolean => {
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const exp = decodedPayload.exp;

    if (!exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  } catch (error) {
    console.error("Erreur vérif expiration JWT :", error);
    return true; // Par sécurité, considère le token comme expiré si erreur
  }
};
