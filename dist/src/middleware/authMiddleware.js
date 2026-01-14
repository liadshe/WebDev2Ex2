"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "defaultsecret";
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = { _id: decoded.userId };
        next();
    }
    catch (_a) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};
exports.default = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map