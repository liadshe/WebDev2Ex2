"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const userController_1 = __importDefault(require("../controllers/userController"));
const router = express_1.default.Router();
router.get("/", userController_1.default.getAll.bind(userController_1.default));
router.get("/:id", userController_1.default.getById.bind(userController_1.default));
router.delete("/:id", authMiddleware_1.default, userController_1.default.del.bind(userController_1.default));
router.put("/:id", authMiddleware_1.default, userController_1.default.update.bind(userController_1.default));
exports.default = router;
//# sourceMappingURL=userRoute.js.map