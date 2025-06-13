import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import itemActions from "./modules/item/itemActions";

router.get("/api/items", itemActions.browse);
router.get("/api/items/:id", itemActions.read);
router.post("/api/items", itemActions.add);

// Service-related routes
import serviceActions from "./modules/service/serviceActions";

router.get("/api/services", serviceActions.browse);
router.get("/api/services/:id", serviceActions.read);
router.post("/api/services", serviceActions.add);
router.delete("/api/services/:id", serviceActions.destroy);
router.put("/api/services/:id", serviceActions.edit);

// User-related routes
import userActions from "./modules/user/userActions";

router.get("/api/users", userActions.browse);
router.get("/api/users/:id", userActions.read);
router.post("/api/users", userActions.add);
router.delete("/api/users/:id", userActions.destroy);

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

// Define votes-related routes
import voteActions from "./modules/vote/voteActions";

router.get("/api/votes", voteActions.browse);
router.get("/api/votes/:id", voteActions.read);
router.post("/api/votes", voteActions.add);

// Define category-related routes
import categoryActions from "./modules/category/categoryActions";

router.get("/api/category", categoryActions.browse);
router.get("/api/category/:id", categoryActions.read);
router.post("/api/category", categoryActions.add);
router.put("/api/category/:id", categoryActions.edit);
router.delete("/api/category/:id", categoryActions.destroy);

// Define statut-related routes
import statutActions from "./modules/statut/statutActions";

router.get("/api/statut", statutActions.browse);
router.get("/api/statut/:id", statutActions.read);
router.post("/api/statut", statutActions.add);
router.put("/api/statut/:id", statutActions.edit);
router.delete("/api/statut/:id", statutActions.destroy);

/* ************************************************************************* */

export default router;
