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
const postModel_1 = __importDefault(require("../models/postModel"));
const testUtils_1 = require("./testUtils");
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Befroe All Tests");
    app = yield (0, index_1.default)();
    yield postModel_1.default.deleteMany();
    yield (0, testUtils_1.registerUserTest)(app);
}));
afterAll(done => {
    done();
});
describe('Posts API', () => {
    test('Check empty DB', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/post');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]); // when db is empty
    }));
    test('create posts', () => __awaiter(void 0, void 0, void 0, function* () {
        for (const post of testUtils_1.postData) {
            const response = yield (0, supertest_1.default)(app)
                .post('/post').set("Authorization", `Bearer ${testUtils_1.userData.token}`)
                .send(post);
            post._id = response.body._id;
            expect(response.statusCode).toBe(201);
            expect(response.body.title).toBe(post.title);
            expect(response.body.content).toBe(post.content);
            expect(response.body.createdBy).toBeDefined();
        }
        ;
    }));
    test('GET all Posts', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/post');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(testUtils_1.postData.length);
    }));
    // get post by id 
    test('GET post by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        // first, get all posts to find an ID
        const response = yield (0, supertest_1.default)(app).get('/post/' + testUtils_1.postData[0]._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(testUtils_1.postData[0].title);
    }));
    // update post by id
    test('UPDATE post by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        testUtils_1.postData[0].title = "updatedPost1";
        testUtils_1.postData[0].content = "updatedContent1";
        const response = yield (0, supertest_1.default)(app)
            .put('/post/' + testUtils_1.postData[0]._id).set("Authorization", `Bearer ${testUtils_1.userData.token}`)
            .send(testUtils_1.postData[0]);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(testUtils_1.postData[0].title);
    }));
    // delete post by id   
    test('DELETE post by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete('/post/' + testUtils_1.postData[0]._id).set("Authorization", `Bearer ${testUtils_1.userData.token}`);
        expect(response.statusCode).toBe(200);
        const getResponse = yield (0, supertest_1.default)(app).get('/post/' + testUtils_1.postData[0]._id);
        expect(getResponse.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=post.test.js.map