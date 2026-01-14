"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postModel_1 = __importDefault(require("../models/postModel"));
const baseController_1 = __importDefault(require("./baseController"));
const postController = new baseController_1.default(postModel_1.default);
exports.default = postController;
//# sourceMappingURL=postContoller.js.map