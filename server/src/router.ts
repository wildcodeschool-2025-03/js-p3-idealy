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
// Define comment-related routes
/* ************************************************************************* */

import commentActions from "./modules/comment/commentActions";

router.get("/api/comments", commentActions.browse);
router.get("/api/comments/:id", commentActions.read);
router.post("/api/comments", commentActions.add);
router.put("/api/comments/:id", commentActions.edit);
router.delete("/api/comments/:id", commentActions.destroy);

// Define media-related routes
/* ************************************************************************* */

import mediaActions from "./modules/media/mediaActions";
router.get("/api/media", mediaActions.browse);
router.get("/api/media/:id", mediaActions.read);
router.post("/api/media", mediaActions.add);
router.put("/api/media/:id", mediaActions.edit);
router.delete("/api/media/:id", mediaActions.destroy);

export default router;
