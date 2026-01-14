"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postContoller_1 = __importDefault(require("../controllers/postContoller"));
const router = express_1.default.Router();
router.get("/", postContoller_1.default.getAll.bind(postContoller_1.default));
router.get("/:id", postContoller_1.default.getById.bind(postContoller_1.default));
router.post("/", postContoller_1.default.create.bind(postContoller_1.default));
router.delete("/:id", postContoller_1.default.del.bind(postContoller_1.default));
router.put("/:id", postContoller_1.default.update.bind(postContoller_1.default));
exports.default = router;
//# sourceMappingURL=postRoute.js.map