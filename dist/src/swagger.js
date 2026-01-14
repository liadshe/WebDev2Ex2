"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "WebDev2Ex2 API",
        version: "1.0.0",
        description: "API documentation for the WebDev2Ex2 project (posts, comments, users, auth).",
    },
    servers: [
        { url: "http://localhost:3000", description: "Local server" }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        },
        schemas: {
            User: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    username: { type: "string" },
                    email: { type: "string", format: "email" },
                    createdAt: { type: "string", format: "date-time" }
                }
            },
            Post: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    title: { type: "string" },
                    content: { type: "string" },
                    author: { $ref: "#/components/schemas/User" },
                    createdAt: { type: "string", format: "date-time" }
                }
            },
            Comment: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    postId: { type: "string" },
                    author: { $ref: "#/components/schemas/User" },
                    content: { type: "string" },
                    createdAt: { type: "string", format: "date-time" }
                }
            },
            AuthRequest: {
                type: "object",
                properties: {
                    username: { type: "string" },
                    password: { type: "string" }
                },
                required: ["username", "password"]
            },
            AuthResponse: {
                type: "object",
                properties: {
                    token: { type: "string" },
                    user: { $ref: "#/components/schemas/User" }
                }
            }
        }
    },
    paths: {
        "/post": {
            get: {
                summary: "List posts",
                responses: { "200": { description: "OK", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Post" } } } } } }
            },
            post: {
                summary: "Create post",
                requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Post" } } } },
                responses: { "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Post" } } } } },
                security: [{ bearerAuth: [] }]
            }
        },
        "/post/{id}": {
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            get: { summary: "Get post by id", responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Post" } } } } } },
            put: { summary: "Update post", requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Post" } } } }, responses: { "200": { description: "OK" } }, security: [{ bearerAuth: [] }] },
            delete: { summary: "Delete post", responses: { "204": { description: "No Content" } }, security: [{ bearerAuth: [] }] }
        },
        "/comment": {
            get: { summary: "List comments", responses: { "200": { description: "OK", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Comment" } } } } } } },
            post: { summary: "Create comment", requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Comment" } } } }, responses: { "201": { description: "Created" } }, security: [{ bearerAuth: [] }] }
        },
        "/user": {
            get: { summary: "List users", responses: { "200": { description: "OK", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } } } } } },
            post: { summary: "Create user", requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } }, responses: { "201": { description: "Created" } } }
        },
        "/auth/register": {
            post: { summary: "Register", requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/AuthRequest" } } } }, responses: { "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } } } }
        },
        "/auth/login": {
            post: { summary: "Login", requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/AuthRequest" } } } }, responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } } } }
        }
    }
};
exports.default = swaggerSpec;
//# sourceMappingURL=swagger.js.map