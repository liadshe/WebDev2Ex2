"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "WebDev2Ex2 API",
        version: "1.0.0",
        description: "Full API documentation including Auth, Users, Posts, and Comments.",
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
                }
            },
            Post: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    content: { type: "string" },
                    createdBy: { type: "string", description: "User ID" }
                },
                required: ["title", "content"]
            },
            Comment: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    postId: { type: "string" },
                    createdBy: { type: "string" }
                },
                required: ["message"]
            }
        }
    },
    paths: {
        // --- AUTH SECTION ---
        "/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register a new user",
                requestBody: { content: { "application/json": { schema: { type: "object", properties: { username: { type: "string" }, email: { type: "string" }, password: { type: "string" } } } } } },
                responses: { "201": { description: "User registered" } }
            }
        },
        "/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Login",
                requestBody: { content: { "application/json": { schema: { type: "object", properties: { email: { type: "string" }, password: { type: "string" } } } } } },
                responses: { "200": { description: "Returns Access and Refresh tokens" } }
            }
        },
        "/auth/refresh-token": {
            post: {
                tags: ["Auth"],
                summary: "Refresh access token",
                responses: { "200": { description: "New tokens generated" } }
            }
        },
        "/auth/logout": {
            post: {
                tags: ["Auth"],
                summary: "Logout user",
                responses: { "200": { description: "Logged out" } }
            }
        },
        // --- USER SECTION ---
        "/user": {
            get: {
                tags: ["Users"],
                summary: "Get all users",
                responses: { "200": { description: "OK" } }
            }
        },
        "/user/{id}": {
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            get: { tags: ["Users"], summary: "Get user by ID", responses: { "200": { description: "OK" } } },
            put: { tags: ["Users"], summary: "Update user", security: [{ bearerAuth: [] }], responses: { "200": { description: "Updated" } } },
            delete: { tags: ["Users"], summary: "Delete user", security: [{ bearerAuth: [] }], responses: { "204": { description: "Deleted" } } }
        },
        // --- POST SECTION ---
        "/post": {
            get: { tags: ["Posts"], summary: "Get all posts", responses: { "200": { description: "OK" } } },
            post: { tags: ["Posts"], summary: "Create post", security: [{ bearerAuth: [] }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Post" } } } }, responses: { "201": { description: "Created" } } }
        },
        "/post/{id}": {
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            get: { tags: ["Posts"], summary: "Get post by ID", responses: { "200": { description: "OK" } } },
            put: { tags: ["Posts"], summary: "Update post", security: [{ bearerAuth: [] }], responses: { "200": { description: "Updated" } } },
            delete: { tags: ["Posts"], summary: "Delete post", security: [{ bearerAuth: [] }], responses: { "204": { description: "Deleted" } } }
        },
        "/post/{id}/comments": {
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            get: { tags: ["Posts"], summary: "Get all comments for a specific post", responses: { "200": { description: "OK" } } }
        },
        "/post/{id}/comment": {
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            post: { tags: ["Posts"], summary: "Add a comment to a post", security: [{ bearerAuth: [] }], requestBody: { content: { "application/json": { schema: { type: "object", properties: { message: { type: "string" } } } } } }, responses: { "201": { description: "Comment added" } } }
        },
        // --- COMMENT SECTION ---
        "/comment": {
            get: { tags: ["Comments"], summary: "List all comments", responses: { "200": { description: "OK" } } }
        },
        "/comment/{id}": {
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            get: { tags: ["Comments"], summary: "Get comment by ID", responses: { "200": { description: "OK" } } },
            put: { tags: ["Comments"], summary: "Update comment", security: [{ bearerAuth: [] }], responses: { "200": { description: "Updated" } } },
            delete: { tags: ["Comments"], summary: "Delete comment", security: [{ bearerAuth: [] }], responses: { "204": { description: "Deleted" } } }
        }
    }
};
exports.default = swaggerSpec;
//# sourceMappingURL=swagger.js.map