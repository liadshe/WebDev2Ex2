import request from "supertest";
import initApp from '../index';
import { Express } from 'express';    
import User from "../models/userModel";
import { usersData } from "./testUtils";

let app:Express;

beforeAll(async () => {  
    console.log("Before All Tests") 
    app = await initApp(); 
    await User.deleteMany();
});

afterAll(done => {      
    done()
})  

describe('User API', () => {

    test('Create User', async () => {
        for (const user of usersData) {
        const response = await request(app).post('/auth/register').send(user);
        user._id = response.body._id;
        user.token = response.body.token;
        user.refreshToken = response.body.refreshToken;
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("refreshToken");
        expect(response.statusCode).toBe(201);
        }
    });

    test('GET all users', async () => {
        const response = await request(app).get('/user');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(usersData.length);


        // store the _id for later tests
        for(let i=0; i<usersData.length; i++) {
            usersData[i]._id = response.body[i]._id;
        }
    });

   
       // get user by id 
       test('GET user by ID', async () => {
           const response = await request(app).get('/user/'+ usersData[0]._id);
           expect(response.statusCode).toBe(200);
           expect(response.body.email).toBe(usersData[0].email);
       });
   
       // update user by id
       test('UPDATE user by ID', async () => {
           usersData[0].email = "updatedUser1@example.com";
           const response = await request(app)
               .put('/user/' + usersData[0]._id)
               .set("Authorization", "Bearer " + usersData[0].token)
               .send(usersData[0]);
           expect(response.statusCode).toBe(200);
           expect(response.body.email).toBe(usersData[0].email);
       });
   
       // delete user by id   
       test('DELETE user by ID', async () => {
           const response = await request(app)
               .delete('/user/' + usersData[0]._id)
               .set("Authorization", "Bearer " + usersData[0].token);
           expect(response.statusCode).toBe(200);
   
           const getResponse = await request(app).get('/user/' + usersData[0]._id);
           expect(getResponse.statusCode).toBe(404);
       });
   
    



});