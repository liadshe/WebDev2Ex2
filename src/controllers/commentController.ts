import commentModel from "../models/commentModel";
import postModel from "../models/postModel";
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

        // create comment
        await super.create(req, res);
        
        // get created comment
        const createdComment = await commentModel.findOne({ createdBy: userId, postId: postId, content: obj.content }).sort({ createdAt: -1 });
        if (!createdComment) {
            return;
        }
        obj._id = createdComment._id;

        // add comment to post's comments array
        const post = await postModel.findById(postId);
        if (!post) {
            return;
        }
        post.comments.push(obj._id);
        await post.save();
        return;
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

        // remove comment from post's comments array
        const post = await postModel.findById(comment.postId);
        if (post) {
            post.comments = post.comments.filter((id) => id.toString() !== commentId);
            await post.save();
        }
        
        return super.del(req, res);;
    }
}

export default new commentController();
