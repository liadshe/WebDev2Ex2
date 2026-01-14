/* eslint-disable @typescript-eslint/no-explicit-any */
import postModel from "../models/postModel";
import baseController from "./baseController";
import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";

class PostController extends baseController {
    constructor() {
        super(postModel);
    }
    async create(req: AuthRequest, res: Response){
        const userId = (req as any).user?._id;
        const obj = req.body;
        obj.createdBy = userId;
        return super.create(req, res);
    }

    async update(req: AuthRequest, res: Response){
        const userId = (req as any).user?._id;
        const postId = req.params.id;
        const post = await postModel.findById(postId);
        if (!post) {
            return;
        }
        if (post.createdBy.toString() !== userId) {
           res.status(403).json({ message: "Forbidden: You can only update your own posts" });
           return;
        }
        return super.update(req, res);
    }

    async del(req: AuthRequest, res: Response) {
        const userId = (req as any).user?._id;
        const postId = req.params.id;
        const post = await postModel.findById(postId);
        if (!post) {
            return;
        }
        if (post.createdBy.toString() !== userId) {
              res.status(403).json({ message: "Forbidden: You can only delete your own posts" });
                return;
        }
        return super.del(req, res);;
    }
}

export default new PostController();