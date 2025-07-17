import express from "express";
import { authenticateToken } from "./modules/auth/authMiddleware";
import { authenticateAdmin } from "./modules/auth/authMiddleware";
import { validateIdeaQuery } from "./modules/idea/ideaValidation";
import { validateIdeaUpdate } from "./modules/idea/ideaValidation";
import { validateIdParam } from "./modules/idea/ideaValidation";
import { validateIdeaSchema } from "./modules/idea/validateIdeaSchema";
import emailValidationMiddleware from "./modules/user/emailValidationMiddleware";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

import categoryActions from "./modules/category/categoryActions";
import commentActions from "./modules/comment/commentActions";
import ideaActions from "./modules/idea/ideaActions";
import serviceActions from "./modules/service/serviceActions";
import statutActions from "./modules/statut/statutActions";
// ===== ROUTES PUBLIQUES (pas de JWT requis) =====
import userActions from "./modules/user/userActions";
import userMiddleware from "./modules/user/userMiddleware";
import voteActions from "./modules/vote/voteActions";

router.post("/api/users/login", userMiddleware.validate, userActions.login);
router.post("/api/users", userMiddleware.validate, userActions.add);

router.get("/api/services", serviceActions.browse);
router.get("/api/services/:id", serviceActions.read);

// Mur d'authentification : tout ce qui suit nécessite un JWT valide
router.use(authenticateToken);

// Service-related routes
router.post("/api/services", serviceActions.add);
router.delete("/api/services/:id", serviceActions.destroy);
router.put("/api/services/:id", serviceActions.edit);

// User-related routes

router.get("/api/users", userActions.browse);
router.get("/api/users/:id", userActions.read);
router.delete("/api/users/:id", userActions.destroy);
router.put("/api/users/:id", userActions.update);

router.get("/api/users/:id/service", userActions.getServiceOfThisUser);
router.patch("/api/users/:id/picture", userActions.editPicture);
router.patch("/api/users/:id/service", userActions.editService);

// Define idea-related routes

router.get("/api/ideas", validateIdeaQuery, ideaActions.browse);
router.get("/api/ideas/history", ideaActions.readHistory);
router.get("/api/ideas/:id", ideaActions.read);
router.post("/api/ideas", validateIdeaSchema, ideaActions.add);

//admin page idea actions
router.put(
  "/api/ideas/:id",
  authenticateAdmin,
  validateIdParam,
  validateIdeaUpdate,
  ideaActions.putValidationOrRefusal,
);
router.delete(
  "/api/ideas/:id",
  authenticateAdmin,
  validateIdParam,
  ideaActions.deleteIdea,
);

router.get("/api/ideas/:id/creator", ideaActions.getCreatorOfThisIdea); // Get the creator (the user marked as "isCreator = true" on the joint) of a specific given idea
router.get("/api/ideas/:id/categories", ideaActions.getCategoriesOfThisIdea); // Get the categories (a table of all key words associated) of a specific given idea
router.get("/api/ideas/:id/comments", commentActions.getCommentsForIdea); // Récupère tous les commentaires d'une idée spécifique
router.get(
  "/api/ideas/:id/participants",
  ideaActions.getParticipantsOfThisIdea,
);

// Define votes-related routes

router.get("/api/ideas/:id/votes", voteActions.getVotesForIdea); // Get votes informations for cards
router.post("/api/votes/upsert", voteActions.upsert); // Create OR Update at the same time
router.post("/api/votes/delete-user-votes", voteActions.deleteUserVotes);

// Define category-related routes

router.get("/api/categories", categoryActions.browse);
router.get("/api/categories/:id", categoryActions.read);

// Define statut-related routes

router.get("/api/status", statutActions.browse);
router.get("/api/status/:id", statutActions.read);

// Define media-related routes

router.get("/api/ideas/:id/medias", ideaActions.getMediasOfThisIdea); // Récupère les médias d'une idée
router.post("/api/ideas/transfer-to-user-2", ideaActions.transferIdea);

// Define comment-related routes

router.post("/api/comments", commentActions.add);
router.post("/api/comments/transfer-to-user-2", commentActions.transferComment);

// Definie statistics routes
import { getStatistics } from "./modules/statistics/statisticsActions";

router.get("/api/statistics", getStatistics);

export default router;
