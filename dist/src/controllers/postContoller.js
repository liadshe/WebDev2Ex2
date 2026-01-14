"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const postModel_1 = __importDefault(require("../models/postModel"));
const baseController_1 = __importDefault(require("./baseController"));
class PostController extends baseController_1.default {
    constructor() {
        super(postModel_1.default);
    }
    create(req, res) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const obj = req.body;
            obj.createdBy = userId;
            return _super.create.call(this, req, res);
        });
    }
    update(req, res) {
        const _super = Object.create(null, {
            update: { get: () => super.update }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const postId = req.params.id;
            const post = yield postModel_1.default.findById(postId);
            if (!post) {
                return;
            }
            if (post.createdBy.toString() !== userId) {
                res.status(403).json({ message: "Forbidden: You can only update your own posts" });
                return;
            }
            return _super.update.call(this, req, res);
        });
    }
    del(req, res) {
        const _super = Object.create(null, {
            del: { get: () => super.del }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const postId = req.params.id;
            const post = yield postModel_1.default.findById(postId);
            if (!post) {
                return;
            }
            if (post.createdBy.toString() !== userId) {
                res.status(403).json({ message: "Forbidden: You can only delete your own posts" });
                return;
            }
            return _super.del.call(this, req, res);
            ;
        });
    }
}
exports.default = new PostController();
//# sourceMappingURL=postContoller.js.map