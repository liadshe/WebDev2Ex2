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
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendError = (res, message, code = 500) => {
    res.status(code).json({ message });
};
const generateToken = (userId, email) => {
    const secret = process.env.JWT_SECRET || "defaultsecret";
    const secretRefresh = process.env.JWT_REFRESH_SECRET || "defaultrefreshsecret";
    const expires = parseInt(process.env.JWT_EXPIRES_IN || "3600");
    const expiresRefresh = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || "604800");
    const token = jsonwebtoken_1.default.sign({ userId: userId, email: email }, secret, { expiresIn: expires });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: userId, email: email, jti: Date.now().toString() }, secretRefresh, { expiresIn: expiresRefresh });
    return { token, refreshToken };
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // extract email and password from req.body
    const { email, password } = req.body;
    // check if email or password is missing
    if (!email || !password) {
        return sendError(res, "Email and password are required");
    }
    try {
        // hash the password
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        // create new user in the database
        const newUser = yield userModel_1.default.create({ email, password: encryptedPassword });
        // generate JWT token
        const { token, refreshToken } = generateToken(newUser._id.toString(), newUser.email);
        // save refresh token to user
        newUser.refreshTokens.push(refreshToken);
        yield newUser.save();
        // respond with the token
        res.status(201).json({ "token": token, "refreshToken": refreshToken });
    }
    catch (error) {
        return sendError(res, "Error registering user: " + error);
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return sendError(res, "Email and password are required");
    }
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return sendError(res, "Invalid email or password", 401);
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return sendError(res, "Invalid email or password", 401);
        }
        // generate JWT token
        const { token, refreshToken } = generateToken(user._id.toString(), user.email);
        // save refresh token to user
        user.refreshTokens.push(refreshToken);
        yield user.save();
        // respond with the token
        res.status(200).json({ "token": token, "refreshToken": refreshToken });
    }
    catch (error) {
        return sendError(res, "Error logging in user: " + error);
    }
});
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return sendError(res, "Refresh token is required");
    }
    try {
        const secretRefresh = process.env.JWT_REFRESH_SECRET || "defaultrefreshsecret";
        const decoded = jsonwebtoken_1.default.verify(refreshToken, secretRefresh);
        const user = yield userModel_1.default.findOneAndUpdate({
            _id: decoded.userId,
            refreshTokens: refreshToken
        }, {
            $pull: { refreshTokens: refreshToken }
        }, { new: true });
        if (!user) {
            return sendError(res, "Invalid refresh token", 401);
        }
        const tokens = generateToken(user._id.toString(), user.email);
        user.refreshTokens.push(tokens.refreshToken);
        yield user.save();
        // respond with the new token
        res.status(200).json(tokens);
    }
    catch (error) {
        return sendError(res, "Error refreshing token: " + error, 401);
    }
});
exports.default = { register, login, refreshToken };
//# sourceMappingURL=authController.js.map