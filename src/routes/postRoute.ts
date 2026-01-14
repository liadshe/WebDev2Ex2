import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import postController from "../controllers/postContoller";

const router = express.Router();

router.get("/", postController.getAll.bind(postController));

router.get("/:id", postController.getById.bind(postController));

router.post("/", authMiddleware, postController.create.bind(postController));

router.delete("/:id", authMiddleware, postController.del.bind(postController));

router.put("/:id", authMiddleware, postController.update.bind(postController));

export default router;