"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    postId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Post" },
    sender: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    message: String
}, { timestamps: true });
exports.default = mongoose_1.default.model("Comment", CommentSchema);
//# sourceMappingURL=commentModel.js.map