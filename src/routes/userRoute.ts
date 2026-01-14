import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import userController from "../controllers/userController";

const router = express.Router();

router.get("/", userController.getAll.bind(userController));  

router.get("/:id", userController.getById.bind(userController));

router.delete("/:id", authMiddleware, userController.del.bind(userController)); 

router.put("/:id", authMiddleware, userController.update.bind(userController));

export default router;  
