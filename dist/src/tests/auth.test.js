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
const postModel_1 = __importDefault(require("../models/postModel"));
const testUtils_1 = require("./testUtils");
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Before All Tests");
    app = yield (0, index_1.default)();
    yield userModel_1.default.deleteMany();
    yield postModel_1.default.deleteMany();
}));
afterAll(done => {
    done();
});
describe('Auth API', () => {
    test("Access restricted url denied", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/post').send(testUtils_1.postData[0]);
        expect(response.statusCode).toBe(401);
    }));
    test('Register Test', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/auth/register').send(testUtils_1.userData);
        testUtils_1.userData._id = response.body._id;
        testUtils_1.userData.token = response.body.token;
        testUtils_1.userData.refreshToken = response.body.refreshToken;
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("refreshToken");
        expect(response.statusCode).toBe(201);
    }));
    test('Login Test', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/auth/login').send(testUtils_1.userData);
        testUtils_1.userData._id = response.body._id;
        testUtils_1.userData.token = response.body.token;
        testUtils_1.userData.refreshToken = response.body.refreshToken;
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("refreshToken");
    }));
    test("Access with token permitted", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/post').set("Authorization", `Bearer ${testUtils_1.userData.token}`).send(testUtils_1.postData[0]);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("_id");
    }));
    test("Access with modified token denied", () => __awaiter(void 0, void 0, void 0, function* () {
        const newToken = testUtils_1.userData.token + "modified";
        const response = yield (0, supertest_1.default)(app).post('/post').set("Authorization", `Bearer ${newToken}`).send(testUtils_1.postData[1]);
        expect(response.statusCode).toBe(401);
    }));
    // set jet timout to 10 seconds
    jest.setTimeout(10000);
    test("Token Expiration", () => __awaiter(void 0, void 0, void 0, function* () {
        // assuming the token expiration is set to 5 second for testing purposes
        yield new Promise(res => setTimeout(res, 6000)); // wait for 6 seconds
        const response = yield (0, supertest_1.default)(app).post('/post').set("Authorization", `Bearer ${testUtils_1.userData.token}`).send(testUtils_1.postData[1]);
        expect(response.statusCode).toBe(401);
        // get new token using refresh token
        const refreshResponse = yield (0, supertest_1.default)(app).post('/auth/refresh-token').send({ refreshToken: testUtils_1.userData.refreshToken });
        expect(refreshResponse.statusCode).toBe(200);
        expect(refreshResponse.body).toHaveProperty("token");
        testUtils_1.userData.token = refreshResponse.body.token;
        testUtils_1.userData.refreshToken = refreshResponse.body.refreshToken;
        // access with new token
        const newResponse = yield (0, supertest_1.default)(app).post('/post').set("Authorization", `Bearer ${testUtils_1.userData.token}`).send(testUtils_1.postData[2]);
        expect(newResponse.statusCode).toBe(201);
    }));
    //test double use of refresh token fails
    test("Refresh token rotation works correctly", () => __awaiter(void 0, void 0, void 0, function* () {
        // create a fresh user just for this test
        const testUser = {
            email: "rotate@test.com",
            password: "123456"
        };
        const register = yield (0, supertest_1.default)(app)
            .post("/auth/register")
            .send(testUser);
        const initialRefreshToken = register.body.refreshToken;
        // FIRST use → success
        const first = yield (0, supertest_1.default)(app)
            .post("/auth/refresh-token")
            .send({ refreshToken: initialRefreshToken });
        expect(first.status).toBe(200);
        const newRefreshToken = first.body.refreshToken;
        // reuse OLD token → fail
        const reusedOld = yield (0, supertest_1.default)(app)
            .post("/auth/refresh-token")
            .send({ refreshToken: initialRefreshToken });
        expect(reusedOld.status).toBe(401);
        // use NEW token → success
        const second = yield (0, supertest_1.default)(app)
            .post("/auth/refresh-token")
            .send({ refreshToken: newRefreshToken });
        expect(second.status).toBe(200);
        // reuse NEW token → fail
        const reusedNew = yield (0, supertest_1.default)(app)
            .post("/auth/refresh-token")
            .send({ refreshToken: newRefreshToken });
        expect(reusedNew.status).toBe(401);
    }));
});
//# sourceMappingURL=auth.test.js.map