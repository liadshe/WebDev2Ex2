import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import postController from "../controllers/postContoller";
import commentController from "../controllers/commentController";

const router = express.Router();

router.get("/", postController.getAll.bind(postController));

router.get("/:id", postController.getById.bind(postController));

router.get("/:id/comments", commentController.getByPostId.bind(commentController));

router.post("/", authMiddleware, postController.create.bind(postController));

router.post("/:id/comment", authMiddleware, commentController.create.bind(commentController));

router.delete("/:id", authMiddleware, postController.del.bind(postController));

router.put("/:id", authMiddleware, postController.update.bind(postController));

export default router;