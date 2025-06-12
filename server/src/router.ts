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

/* ************************************************************************* */

// Define category-related routes
import categoryActions from "./modules/category/categoryActions";

router.get("/api/category", categoryActions.browse);
router.get("/api/category/:id", categoryActions.read);
router.post("/api/category", categoryActions.add);
router.put("/api/category/:id", categoryActions.edit);
router.delete("/api/category/:id", categoryActions.destroy);

/* ************************************************************************* */

// Define statut-related routes
import statutActions from "./modules/statut/statutActions";

router.get("/api/statut", statutActions.browse);
router.get("/api/statut/:id", statutActions.read);
router.post("/api/statut", statutActions.add);
router.put("/api/statut/:id", statutActions.edit);
router.delete("/api/statut/:id", statutActions.destroy);

export default router;
