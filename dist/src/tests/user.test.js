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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const userModel_1 = __importDefault(require("../models/userModel"));
const testUtils_1 = require("./testUtils");
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Before All Tests");
    app = yield (0, index_1.default)();
    yield userModel_1.default.deleteMany();
}));
afterAll(done => {
    done();
});
describe('User API', () => {
    test('Create User', () => __awaiter(void 0, void 0, void 0, function* () {
        for (const user of testUtils_1.usersData) {
            const response = yield (0, supertest_1.default)(app).post('/auth/register').send(user);
            user._id = response.body._id;
            user.token = response.body.token;
            user.refreshToken = response.body.refreshToken;
            expect(response.body).toHaveProperty("token");
            expect(response.body).toHaveProperty("refreshToken");
            expect(response.statusCode).toBe(201);
        }
    }));
    test('GET all users', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/user');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(testUtils_1.usersData.length);
        // store the _id for later tests
        for (let i = 0; i < testUtils_1.usersData.length; i++) {
            testUtils_1.usersData[i]._id = response.body[i]._id;
        }
    }));
    // get user by id 
    test('GET user by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/user/' + testUtils_1.usersData[0]._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.email).toBe(testUtils_1.usersData[0].email);
    }));
    // update user by id
    test('UPDATE user by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        testUtils_1.usersData[0].email = "updatedUser1@example.com";
        const response = yield (0, supertest_1.default)(app)
            .put('/user/' + testUtils_1.usersData[0]._id)
            .set("Authorization", "Bearer " + testUtils_1.usersData[0].token)
            .send(testUtils_1.usersData[0]);
        expect(response.statusCode).toBe(200);
        expect(response.body.email).toBe(testUtils_1.usersData[0].email);
    }));
    // delete user by id   
    test('DELETE user by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete('/user/' + testUtils_1.usersData[0]._id)
            .set("Authorization", "Bearer " + testUtils_1.usersData[0].token);
        expect(response.statusCode).toBe(200);
        const getResponse = yield (0, supertest_1.default)(app).get('/user/' + testUtils_1.usersData[0]._id);
        expect(getResponse.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=user.test.js.map