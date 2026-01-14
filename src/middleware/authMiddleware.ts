import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AuthRequest = Request & { user?: { _id: string } };


const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const secret:string = process.env.JWT_SECRET || "defaultsecret";

    try {
        const decoded = jwt.verify(token, secret) as { userId: string};
        req.user = { _id: decoded.userId };
        next();
    }
    catch {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
}

export default authMiddleware;