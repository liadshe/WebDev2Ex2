import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  sender: {type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String
}, { timestamps: true });

export default mongoose.model("Comment", CommentSchema);
