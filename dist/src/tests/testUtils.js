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
exports.registerUserTest = exports.commentData = exports.postData = exports.userData = void 0;
const supertest_1 = __importDefault(require("supertest"));
const userModel_1 = __importDefault(require("../models/userModel"));
exports.userData = { email: "test@example.com", password: "testpassword" };
exports.postData = [
    {
        title: "post1", content: "hello post1",
    },
    {
        title: "post2", content: "hello post2",
    },
    {
        title: "post3", content: "hello post3",
    }
];
exports.commentData = [
    {
        postId: "1111", message: "comment1", sender: "sender1",
    },
    {
        postId: "2222", message: "comment2", sender: "sender2",
    },
    {
        postId: "3333", message: "comment3", sender: "sender3",
    }
];
const registerUserTest = (app) => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.default.deleteMany({ "email": exports.userData.email });
    // register user and get token
    const response = yield (0, supertest_1.default)(app).post('/auth/register').send(exports.userData);
    exports.userData._id = response.body._id;
    exports.userData.token = response.body.token;
    return response;
});
exports.registerUserTest = registerUserTest;
//# sourceMappingURL=testUtils.js.map