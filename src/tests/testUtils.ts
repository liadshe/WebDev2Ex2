import { Express } from "express";
import request from "supertest";
import User from "../models/userModel";

type user = {
    email: string;
    password: string;   
    _id?: string;
    token?: string;
    refreshToken?: string;
};

export const userData:user = {email: "test@example.com", password: "testpassword"};

type post = {
    title: string;
    content: string;
    createdBy?: string;
    comments?: string[];
    _id?: string;
};

export const postData:post[] = [
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

type comment = {
    postId: string;
    sender: string;
    message: string;
    _id?: string;
};
export const commentData:comment[] = [
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

export const registerUserTest = async (app: Express) => {
    await User.deleteMany({"email": userData.email});
    // register user and get token
    const response = await request(app).post('/auth/register').send(userData);
    userData._id = response.body._id;
    userData.token = response.body.token;
    return response;
}