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
const commentModel_1 = __importDefault(require("../models/commentModel"));
const testUtils_1 = require("./testUtils");
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Befroe All Tests");
    app = yield (0, index_1.default)();
    yield commentModel_1.default.deleteMany();
    yield (0, testUtils_1.registerUserTest)(app);
}));
afterAll(done => {
    done();
});
describe('Comments API', () => {
    test('Check empty DB', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/comment');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]); // when db is empty
    }));
    test('create post', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/post').set("Authorization", `Bearer ${testUtils_1.userData.token}`)
            .send(testUtils_1.postData[0]);
        testUtils_1.postData[0]._id = response.body._id;
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(testUtils_1.postData[0].title);
        expect(response.body.content).toBe(testUtils_1.postData[0].content);
        expect(response.body.createdBy).toBeDefined();
    }));
    test('Create Comments', () => __awaiter(void 0, void 0, void 0, function* () {
        for (const comment of testUtils_1.commentData) {
            const response = yield (0, supertest_1.default)(app)
                .post('/post/' + testUtils_1.postData[0]._id + '/comment')
                .set("Authorization", "Bearer " + testUtils_1.userData.token)
                .send(comment);
            comment.postId = response.body.postId;
            comment._id = response.body._id;
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe(comment.message);
            expect(response.body.postId).toBe(comment.postId);
            expect(response.body.createdBy).toBeDefined();
        }
        ;
    }));
    test('GET all comments', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/comment');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(testUtils_1.commentData.length);
        // store the _id for later tests
        for (let i = 0; i < testUtils_1.commentData.length; i++) {
            testUtils_1.commentData[i]._id = response.body[i]._id;
        }
    }));
    test('GET comments by PostId', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/post/' + testUtils_1.commentData[0].postId + '/comments');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(testUtils_1.commentData.length);
    }));
    // get comment by id 
    test('GET comment by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        // first, get all comments to find an ID
        const response = yield (0, supertest_1.default)(app).get('/comment/' + testUtils_1.commentData[0]._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(testUtils_1.commentData[0].message);
    }));
    // update comment by id
    test('UPDATE comment by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        testUtils_1.commentData[0].message = "updatedComment1";
        const response = yield (0, supertest_1.default)(app)
            .put('/comment/' + testUtils_1.commentData[0]._id)
            .set("Authorization", "Bearer " + testUtils_1.userData.token)
            .send(testUtils_1.commentData[0]);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(testUtils_1.commentData[0].message);
    }));
    // delete comment by id   
    test('DELETE comment by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete('/comment/' + testUtils_1.commentData[0]._id)
            .set("Authorization", "Bearer " + testUtils_1.userData.token);
        expect(response.statusCode).toBe(200);
        const getResponse = yield (0, supertest_1.default)(app).get('/comment/' + testUtils_1.commentData[0]._id);
        expect(getResponse.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=comment.test.js.map