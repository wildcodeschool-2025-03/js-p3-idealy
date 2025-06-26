import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Service-related routes
import serviceActions from "./modules/service/serviceActions";

router.get("/api/services", serviceActions.browse);
router.get("/api/services/:id", serviceActions.read);
router.post("/api/services", serviceActions.add);
router.delete("/api/services/:id", serviceActions.destroy);
router.put("/api/services/:id", serviceActions.edit);

// User-related routes
import userActions from "./modules/user/userActions";

router.post("/api/users/login", userActions.login);

router.get("/api/users", userActions.browse);
router.get("/api/users/:id", userActions.read);
router.post("/api/users", userActions.add);
router.delete("/api/users/:id", userActions.destroy);

router.get("/api/users/:id/service", userActions.getServiceOfThisUser);

router.put("/api/users/:id", userActions.update);

router.patch("/api/users/:id/firstname", userActions.editFirstname);
router.patch("/api/users/:id/lastname", userActions.editLastname);
router.patch("/api/users/:id/mail", userActions.editMail);
router.patch("/api/users/:id/password", userActions.editPassword);
router.patch("/api/users/:id/picture", userActions.editPicture);
router.patch("/api/users/:id/service", userActions.editService);

// Define idea-related routes
import ideaActions from "./modules/idea/ideaActions";

router.get("/api/ideas", ideaActions.browse);
router.get("/api/ideas/:id", ideaActions.read);
router.post("/api/ideas", ideaActions.add);

//admin page idea actions
router.put("/api/ideas/:id", ideaActions.putValidationOrRefusal);
router.delete("/api/ideas/:id", ideaActions.deleteIdea);

//router.get("/api/ideas/to-validate", ideaActions.browseToValidate);

router.get("/api/ideas/:id/creator", ideaActions.getCreatorOfThisIdea); // Get the creator (the user marked as "isCreator = true" on the joint) of a specific given idea
router.get("/api/ideas/:id/votes", ideaActions.getVotesInformationsOfThisIdea); // Get the votes informations (number of agree and disagree) of a specific given idea
router.get("/api/ideas/:id/categories", ideaActions.getCategoriesOfThisIdea); // Get the categories (a table of all key words associated) of a specific given idea

// Define votes-related routes
import voteActions from "./modules/vote/voteActions";

router.get("/api/votes", voteActions.browse);
router.get("/api/votes/:id", voteActions.read);
router.post("/api/votes", voteActions.add);

router.post("/api/votes/upsert", voteActions.upsert); // Create OR Update at the same time

// Define category-related routes
import categoryActions from "./modules/category/categoryActions";

router.get("/api/categories", categoryActions.browse);
router.get("/api/categories/:id", categoryActions.read);
router.post("/api/categories", categoryActions.add);
router.put("/api/categories/:id", categoryActions.edit);
router.delete("/api/categories/:id", categoryActions.destroy);

// Define statut-related routes
import statutActions from "./modules/statut/statutActions";

router.get("/api/status", statutActions.browse);
router.get("/api/status/:id", statutActions.read);
router.post("/api/status", statutActions.add);
router.put("/api/status/:id", statutActions.edit);
router.delete("/api/status/:id", statutActions.destroy);

// Define media-related routes
import mediaActions from "./modules/media/mediaActions";

router.get("/api/medias", mediaActions.browse);
router.get("/api/medias/:id", mediaActions.read);
router.post("/api/medias", mediaActions.add);
router.put("/api/medias/:id", mediaActions.edit);
router.delete("/api/medias/:id", mediaActions.destroy);

// Define comment-related routes
import commentActions from "./modules/comment/commentActions";

router.get("/api/comments", commentActions.browse);
router.get("/api/comments/:id", commentActions.read);
router.post("/api/comments", commentActions.add);
router.put("/api/comments/:id", commentActions.edit);
router.delete("/api/comments/:id", commentActions.destroy);

// Definie statistics routes
import { getStatistics } from "./modules/statistics/statisticsActions";

router.get("/api/statistics", getStatistics);

export default router;
