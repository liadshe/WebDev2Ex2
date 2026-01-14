import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import commentsController from "../controllers/commentController";

const router = express.Router();

router.get("/", authMiddleware, commentsController.getAll.bind(commentsController)); 

router.get("/:id", commentsController.getById.bind(commentsController));

router.post("/", authMiddleware, commentsController.create.bind(commentsController));

router.delete("/:id", authMiddleware, commentsController.del.bind(commentsController));    

router.put("/:id", authMiddleware, commentsController.update.bind(commentsController));

export default router;