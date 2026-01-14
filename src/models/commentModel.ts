import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  sender: String,
  message: String
}, { timestamps: true });

export default mongoose.model("Comment", CommentSchema);
