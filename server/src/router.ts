import express from "express";
import ideaActions from "./modules/idea/ideaActions";
import voteActions from "./modules/vote/voteActions";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import itemActions from "./modules/item/itemActions";

router.get("/api/items", itemActions.browse);
router.get("/api/items/:id", itemActions.read);
router.post("/api/items", itemActions.add);

router.get("/api/ideas", ideaActions.browse);
router.get("/api/ideas/:id", ideaActions.read);
router.post("/api/ideas", ideaActions.add);

router.get("/api/votes", voteActions.browse);
router.get("/api/votes/:id", voteActions.read);
router.post("/api/votes", voteActions.add);

/* ************************************************************************* */

export default router;
