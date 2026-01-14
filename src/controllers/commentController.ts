import commentModel from "../models/commentModel";
import baseController from "./baseController";
import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";

class commentController extends baseController {
    constructor() {
        super(commentModel);
    }
    async create(req: AuthRequest, res: Response){
        const userId = (req as any).user?._id;
        const obj = req.body;
        obj.createdBy = userId;
        const postId = req.body.postId ? req.body.postId : req.params.id;
        obj.postId = postId;
        return super.create(req, res);
    }

    async getByPostId(req: AuthRequest, res: Response){
        const postId = req.params.id;
        const comments = await commentModel.find({postId: postId});
        res.json(comments);
    }
    
    async update(req: AuthRequest, res: Response){
        const userId = (req as any).user?._id;
        const commentId = req.params.id;
        const comment = await commentModel.findById(commentId);
        if (!comment) {
            return;
        }
        if (comment.createdBy.toString() !== userId) {
           res.status(403).json({ message: "Forbidden: You can only update your own comments" });
           return;
        }
        return super.update(req, res);
    }

    async del(req: AuthRequest, res: Response) {
        const userId = (req as any).user?._id;
        const commentId = req.params.id;
        const comment = await commentModel.findById(commentId);
        if (!comment) {
            return;
        }
        if (comment.createdBy.toString() !== userId) {
              res.status(403).json({ message: "Forbidden: You can only delete your own comments" });
                return;
        }
        return super.del(req, res);;
    }
}

export default new commentController();
