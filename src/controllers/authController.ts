import {Request, Response} from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface DecodedToken {
    userId: string;
    email: string;
}

const sendError = (res: Response, message: string, code: number = 500) => {
    res.status(code).json({ message });
}
type Tokens = {
    token: string;
    refreshToken: string;
}
const generateToken = (userId: string, email: string): Tokens => {
        const secret = process.env.JWT_SECRET || "defaultsecret";
        const secretRefresh = process.env.JWT_REFRESH_SECRET || "defaultrefreshsecret";
        const expires: number = parseInt(process.env.JWT_EXPIRES_IN || "3600");     
        const expiresRefresh: number = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || "604800");
        const token = jwt.sign({ userId: userId, email: email }, secret, { expiresIn: expires });
        const refreshToken = jwt.sign({ userId: userId, email: email, jti: Date.now().toString()  }, secretRefresh, { expiresIn: expiresRefresh });
        return { token, refreshToken };
}

const register = async (req: Request, res: Response) => {
    // extract email and password from req.body
    const { email, password } = req.body;

    // check if email or password is missing
    if (!email || !password) {
        return sendError(res, "Email and password are required");
    }
    try {

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    // create new user in the database
    const newUser = await User.create({ email, password: encryptedPassword });

    // generate JWT token
    const { token, refreshToken } = generateToken(newUser._id.toString(), newUser.email);

    // save refresh token to user
    newUser.refreshTokens.push(refreshToken);
    await newUser.save();

    // respond with the token
    res.status(201).json({ "token": token, "refreshToken": refreshToken });
    } 
    catch (error) {
        return sendError(res, "Error registering user: " + error);
    }

};
const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return sendError(res, "Email and password are required");
    }

    try{
        const user = await User.findOne({ email });
        if (!user) {
            return sendError(res, "Invalid email or password", 401);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return sendError(res, "Invalid email or password", 401);
        }

        // generate JWT token
        const { token, refreshToken } = generateToken(user._id.toString(), user.email);

        // save refresh token to user
        user.refreshTokens.push(refreshToken);
        await user.save();

        // respond with the token
        res.status(200).json({ "token": token, "refreshToken": refreshToken });

    }
    catch (error) {
        return sendError(res, "Error logging in user: " + error);
    }
};

const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return sendError(res, "Refresh token is required");
    }   
    try {
        const secretRefresh = process.env.JWT_REFRESH_SECRET || "defaultrefreshsecret";
        const decoded = jwt.verify(refreshToken, secretRefresh) as DecodedToken;
        
        const user = await User.findOneAndUpdate(
            {
                _id: decoded.userId,
                refreshTokens: refreshToken
            },
            {
                $pull: { refreshTokens: refreshToken }
            },
            { new: true }
        );
        
    
        if (!user) {
            return sendError(res, "Invalid refresh token", 401);
        }

        const tokens = generateToken(user._id.toString(), user.email)

        user.refreshTokens.push(tokens.refreshToken)

        await user.save();


        // respond with the new token
        res.status(200).json(tokens);
    } catch (error) {
        return sendError(res, "Error refreshing token: " + error, 401);
    }

};

export default { register, login, refreshToken }