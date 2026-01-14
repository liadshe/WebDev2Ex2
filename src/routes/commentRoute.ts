import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import commentController from "../controllers/commentController";

const router = express.Router();

router.get("/", commentController.getAll.bind(commentController)); 

router.get("/:id", commentController.getById.bind(commentController));

router.delete("/:id", authMiddleware, commentController.del.bind(commentController));    

router.put("/:id", authMiddleware, commentController.update.bind(commentController));

export default router;