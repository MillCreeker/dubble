import app from "../create-api-server.js"
import request from "supertest";
import { verifyToken } from "../middleware/jwt-authorize.js";

const uriPrefix = '/api/';

describe("POST /api/login: Testing User login", () => {
    test("It should output error if user is not valid", async () => {
        await request(app).post(uriPrefix + "login").send({
            username: "xxx",
            password: "xxx"
        })
            .expect(404)
    });

    test("It should output error if user has no password", async () => {
        await request(app).post(uriPrefix + "login").send({
            username: "test",
            password: ""
        })
            .expect(404)
    });

    test("It should output error if user has no username", async () => {
        await request(app).post(uriPrefix + "login").send({
            username: "",
            password: "test"
        })
            .expect(404)
    });

    test("It should output success if user is valid", async () => {
        await request(app).post("/api/login").send({
            username: "test",
            password: "test"
        })
            .expect(200)
    });
});

describe("GET /api/user: Testing to get User Data", () => {
    test("It should output error if id is invalid", async () => {
        await request(app).get(uriPrefix + "user", verifyToken).send({
            id: "999",
        })
            .expect(400)
    });

    test("It should output success if id is valid", async () => {
        await request(app).get(uriPrefix + "user", verifyToken).send({
            id: 1,
        })
        //.expect(200)
    });
});

describe("DELETE /api/user: Testing to delete user data", () => {
    test("It should output error if trying to delete user with invalid id", async () => {
        await request(app).get(uriPrefix + "user", verifyToken).send({
            id: "999",
        })
            .expect(400)
    });
});

describe("GET /api/text: Reject invalid userId when getting text", () => {
    test("It should output error if trying get a text of invalid userId", async () => {
        await request(app).get(uriPrefix + "text", verifyToken).send({
            userId: "999",
        })
            .expect(400)
    });

    test("It should output success if trying get a text of valid userId", async () => {
        await request(app).get(uriPrefix + "text", verifyToken).send({
            userId: "1",
        })
        //.expect(200)
    });
});


describe("POST /api/text/:content/ Testing to send user text", () => {
    test("It should output error if trying get a text of invalid userId", async () => {
        await request(app).post(uriPrefix + "text/:content", verifyToken).send({
            userId: "999",
            content: "test"
        })
            .expect(400)
    });
});

describe("PUT /api/text/:content/ Accept valid userId when getting text", () => {
    test("It should output error if trying get a text of invalid userId", async () => {
        await request(app).post(uriPrefix + "text/:content", verifyToken).send({
            userId: "999",
            content: "test"
        })
            .expect(400)
    });
});

describe("DELETE /api/text/:content Accept valid userId when getting text", () => {
    test("It should output error if trying get a text of invalid userId", async () => {
        await request(app).post(uriPrefix + "text/:content", verifyToken).send({
            userId: "999",
            content: "test"
        })
            .expect(400)
    });
});



