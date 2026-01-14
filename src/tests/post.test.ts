import request from "supertest";
import initApp from '../index';
import postModel from '../models/postModel';
import { Express } from 'express';    
import { registerUserTest, userData, postData} from "./testUtils";
let app:Express;


beforeAll(async () => {  
    console.log("Befroe All Tests") 
    app = await initApp();    
    await postModel.deleteMany();
    await registerUserTest(app);
});

afterAll(done => {      
    done()
})  

describe('Posts API', () => {
    test('Check empty DB', async () => {
        const response = await request(app).get('/post');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]); // when db is empty
    });

    test('create posts', async () => {
       for (const post of postData){
        const response = await request(app)
            .post('/post').set("Authorization", `Bearer ${userData.token}`)
            .send(post);
        post._id = response.body._id;
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(post.title);
        expect(response.body.content).toBe(post.content);
        expect(response.body.createdBy).toBeDefined();
        

       };
    }) ;
    test('GET all Posts', async () => {    
        const response = await request(app).get('/post');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(postData.length);
    });
    

    // get post by id 
    test('GET post by ID', async () => {
        // first, get all posts to find an ID
        const response = await request(app).get('/post/'+ postData[0]._id);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(postData[0].title);
    });

    // update post by id
    test('UPDATE post by ID', async () => {
        postData[0].title = "updatedPost1";
        postData[0].content = "updatedContent1";
        const response = await request(app)
            .put('/post/' + postData[0]._id).set("Authorization", `Bearer ${userData.token}`)
            .send(postData[0]);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(postData[0].title);
    });

    // delete post by id   
    test('DELETE post by ID', async () => {

        // add comment to post to test cascade delete
        const commentResponse = await request(app)
            .post('/post/' + postData[0]._id + '/comment')
            .set("Authorization", "Bearer " + userData.token)
            .send({ message: "Comment to be deleted with post" });
        expect(commentResponse.statusCode).toBe(201);
        expect(commentResponse.body.message).toBe("Comment to be deleted with post");
        expect(commentResponse.body.postId).toBe(postData[0]._id);
        expect(commentResponse.body.createdBy).toBeDefined();

        // delete post
        const response = await request(app)
            .delete('/post/' + postData[0]._id).set("Authorization", `Bearer ${userData.token}`);
        expect(response.statusCode).toBe(200);

        const getResponse = await request(app).get('/post/' + postData[0]._id);
        expect(getResponse.statusCode).toBe(404);
        const commentGetResponse = await request(app).get('/comment/' + commentResponse.body._id);
        expect(commentGetResponse.statusCode).toBe(404);
        
    });

});