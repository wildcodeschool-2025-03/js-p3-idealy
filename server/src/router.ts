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

/* ************************************************************************* */

export default router;
