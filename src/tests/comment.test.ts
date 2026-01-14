import request from "supertest";
import initApp from '../index';
import commentModel from '../models/commentModel';
import { Express } from 'express';  
import {registerUserTest, commentData, userData, postData} from "./testUtils";

let app:Express;



beforeAll(async () => {  
    console.log("Befroe All Tests") 
    app = await initApp();    
   await commentModel.deleteMany();
   await registerUserTest(app);
});

afterAll(done => {      
    done()
})  

describe('Comments API', () => {
    test('Check empty DB', async () => {
        const response = await request(app).get('/comment');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]); // when db is empty
    });

    test('create post', async () => {
            const response = await request(app)
                .post('/post').set("Authorization", `Bearer ${userData.token}`)
                .send(postData[0]);
            postData[0]._id = response.body._id;
            expect(response.statusCode).toBe(201);
            expect(response.body.title).toBe(postData[0].title);
            expect(response.body.content).toBe(postData[0].content);
            expect(response.body.createdBy).toBeDefined();
            
    
           });

    test('Create Comments', async () => {
       for (const comment of commentData){
        const response = await request(app)
            .post('/post/' + postData[0]._id + '/comment')
            .set("Authorization", "Bearer " + userData.token)
            .send(comment);
        comment.postId = response.body.postId;
        comment._id = response.body._id;
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe(comment.message);
        expect(response.body.postId).toBe(comment.postId);
        expect(response.body.createdBy).toBeDefined();
       };
    }) ;

    test('GET all comments', async () => {
        const response = await request(app).get('/comment');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(commentData.length);

        // store the _id for later tests
        for (let i=0; i<commentData.length; i++){
            commentData[i]._id = response.body[i]._id;
        }
    });

    test('GET comments by PostId', async () => {
        const response = await request(app).get('/post/' + commentData[0].postId + '/comments');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(commentData.length);
    });

    // get comment by id 
    test('GET comment by ID', async () => {
        // first, get all comments to find an ID
        const response = await request(app).get('/comment/'+ commentData[0]._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(commentData[0].message);
    });

    // update comment by id
    test('UPDATE comment by ID', async () => {
        commentData[0].message = "updatedComment1";        
        const response = await request(app)
            .put('/comment/' + commentData[0]._id)
            .set("Authorization", "Bearer " + userData.token)
            .send(commentData[0]);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(commentData[0].message  );
    });

    // delete comment by id   
    test('DELETE comment by ID', async () => {
        const response = await request(app)
            .delete('/comment/' + commentData[0]._id)
            .set("Authorization", "Bearer " + userData.token);
        expect(response.statusCode).toBe(200);

        const getResponse = await request(app).get('/comment/' + commentData[0]._id);
        expect(getResponse.statusCode).toBe(404);
    });

});