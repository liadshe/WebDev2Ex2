import request from "supertest";
import initApp from '../index';
import { Express } from 'express';    
import User from "../models/userModel";
import Post from "../models/postModel";
import {userData, postData} from "./testUtils";

let app:Express;



beforeAll(async () => {  
    console.log("Before All Tests") 
    app = await initApp(); 
    await User.deleteMany();
    await Post.deleteMany();   
});

afterAll(done => {      
    done()
})  

describe('Auth API', () => {

    test("Access restricted url denied", async () => {
        const response = await request(app).post('/post').send(postData[0]);
        expect(response.statusCode).toBe(401);
    });

    test('Register Test', async () => {
        const response = await request(app).post('/auth/register').send(userData);
        userData._id = response.body._id;
        userData.token = response.body.token;
        userData.refreshToken = response.body.refreshToken;
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("refreshToken");
        expect(response.statusCode).toBe(201);
    });

    test('Login Test', async () => {
        const response = await request(app).post('/auth/login').send(userData);
         userData._id = response.body._id;
        userData.token = response.body.token;
        userData.refreshToken = response.body.refreshToken;  
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("refreshToken");
    });

    test("Access with token permitted", async () => {       
        const response = await request(app).post('/post').set("Authorization", `Bearer ${userData.token}`).send(postData[0]);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("_id");
    });

    test("Access with modified token denied", async () => {   
        const newToken = userData.token + "modified";    
        const response = await request(app).post('/post').set("Authorization", `Bearer ${newToken}`).send(postData[1]);
        expect(response.statusCode).toBe(401);
    });
    
    // set jet timout to 10 seconds
    jest.setTimeout(10000);

    test("Token Expiration", async () => {
        // assuming the token expiration is set to 5 second for testing purposes
        await new Promise(res => setTimeout(res, 6000)); // wait for 6 seconds
        const response = await request(app).post('/post').set("Authorization", `Bearer ${userData.token}`).send(postData[1]);
        expect(response.statusCode).toBe(401);  

        // get new token using refresh token
        const refreshResponse = await request(app).post('/auth/refresh-token').send({refreshToken: userData.refreshToken});
        expect(refreshResponse.statusCode).toBe(200);
        expect(refreshResponse.body).toHaveProperty("token");
        userData.token = refreshResponse.body.token;
        userData.refreshToken = refreshResponse.body.refreshToken;

        // access with new token
        const newResponse = await request(app).post('/post').set("Authorization", `Bearer ${userData.token}`).send(postData[2]);
        expect(newResponse.statusCode).toBe(201);

    });

      //test double use of refresh token fails
 test("Refresh token rotation works correctly", async () => {
  // create a fresh user just for this test
  const testUser = {
    email: "rotate@test.com",
    password: "123456"
  };

  const register = await request(app)
    .post("/auth/register")
    .send(testUser);

  const initialRefreshToken = register.body.refreshToken;

  // FIRST use → success
  const first = await request(app)
    .post("/auth/refresh-token")
    .send({ refreshToken: initialRefreshToken });

  expect(first.status).toBe(200);
  const newRefreshToken = first.body.refreshToken;

  // reuse OLD token → fail
  const reusedOld = await request(app)
    .post("/auth/refresh-token")
    .send({ refreshToken: initialRefreshToken });

  expect(reusedOld.status).toBe(401);

  // use NEW token → success
  const second = await request(app)
    .post("/auth/refresh-token")
    .send({ refreshToken: newRefreshToken });

  expect(second.status).toBe(200);

  // reuse NEW token → fail
  const reusedNew = await request(app)
    .post("/auth/refresh-token")
    .send({ refreshToken: newRefreshToken });

  expect(reusedNew.status).toBe(401);
});

test("Logout invalidates refresh token", async () => {
    // create a fresh user just for this test

    const refreshToken = userData.refreshToken;
  
    // logout
    const logout = await request(app)
      .post("/auth/logout")
      .send({ refreshToken });
  
    expect(logout.status).toBe(200);
    // try to use the refresh token after logout
    const refreshAttempt = await request(app)
      .post("/auth/refresh-token")
      .send({ refreshToken });
  
    expect(refreshAttempt.status).toBe(401);
  });




});