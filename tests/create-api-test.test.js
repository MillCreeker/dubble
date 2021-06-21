import app from "../api-server.js"
import request from "supertest";
import { DBConnection } from "../util/db-connection.js";

const uriPrefix = '/api/';
var token = '';

/**
 * Positive tests
 */

describe("POST login", () => {
    test("returns an access token", async () => {
        const response = await request(app)
        .post(uriPrefix + "login")
        .send({
            username: "test",
            password: "test"
        });
        expect(typeof response.body.accessToken).toBe("string");
        expect(response.statusCode).toBe(200);
        token = response.body.accessToken;
    });
});

describe("GET user", () => {
    test("returns the user's information", async () => {
        const response = await request(app)
        .get(uriPrefix + "user")
        .set("x-access-token", token);
        expect(response.body.user.username).toBe("test");
        expect(response.statusCode).toBe(200);
    });
});

describe("POST text", () => {
    test("creates the user's text", async () => {
        const response = await request(app)
        .post(uriPrefix + "user/text")
        .set("x-access-token", token)
        .send({content: "test-text"});
        expect(typeof response.body.id).toBe("number");
        expect(response.statusCode).toBe(200);
    });
});

describe("GET text", () => {
    test("returns the user's text", async () => {
        const response = await request(app)
        .get(uriPrefix + "user/text")
        .set("x-access-token", token);
        expect(response.body.textItem.text).toBe("test-text");
        expect(response.statusCode).toBe(200);
    });
});

describe("PUT text", () => {
    test("changes the user's text", async () => {
        const response = await request(app)
        .put(uriPrefix + "user/text")
        .set("x-access-token", token)
        .send({content: "test-text"});
        expect(response.body.message).toBe("success");
        expect(response.statusCode).toBe(200);
    });
});

describe("DELETE text", () => {
    test("deletes the user's text", async () => {
        const response = await request(app)
        .delete(uriPrefix + "user/text")
        .set("x-access-token", token);
        expect(response.body.message).toBe("success");
        expect(response.statusCode).toBe(200);
    });
});

/**
 * Negative tests
 */

describe("POST login", () => {
    test("it should output error if user is not valid", async () => {
        const response = await request(app)
        .post(uriPrefix + "login")
        .send({
            username: "xxx",
            password: "xxx"
        });
        expect(response.statusCode).toBe(404);
    });
});

describe("POST login", () => {
    test("it should output error if user has no password", async () => {
        const response = await request(app)
        .post(uriPrefix + "login")
        .send({
            username: "xxx",
            password: ""
        });
        expect(response.statusCode).toBe(404);
    });
});

describe("POST login", () => {
    test("it should output error if user has no password", async () => {
        const response = await request(app)
        .post(uriPrefix + "login")
        .send({
            username: "",
            password: "xxx"
        });
        expect(response.statusCode).toBe(404);
    });
});

// no access-token

describe("GET user", () => {
    test("it should output error if the access-token is not supplied", async () => {
        const response = await request(app)
        .get(uriPrefix + "user");
        expect(response.statusCode).toBe(400);
    });
});

describe("DELETE user", () => {
    test("it should output error if the access-token is not supplied", async () => {
        const response = await request(app)
        .delete(uriPrefix + "user");
        expect(response.statusCode).toBe(400);
    });
});

describe("POST text", () => {
    test("it should output error if the access-token is not supplied", async () => {
        const response = await request(app)
        .post(uriPrefix + "user/text");
        expect(response.statusCode).toBe(400);
    });
});

describe("GET text", () => {
    test("it should output error if the access-token is not supplied", async () => {
        const response = await request(app)
        .get(uriPrefix + "user/text");
        expect(response.statusCode).toBe(400);
    });
});

describe("PUT text", () => {
    test("it should output error if the access-token is not supplied", async () => {
        const response = await request(app)
        .put(uriPrefix + "user/text")
        .send({content: "test-text"});
        expect(response.statusCode).toBe(400);
    });
});

describe("DELETE text", () => {
    test("it should output error if the access-token is not supplied", async () => {
        const response = await request(app)
        .delete(uriPrefix + "user/text");
        expect(response.statusCode).toBe(400);
    });
});

// wrong access-token

describe("GET user", () => {
    test("it should output error if the access-token is not supplied", async () => {
        const response = await request(app)
        .get(uriPrefix + "user")
        .set("x-access-token", "wrong token");
        expect(response.statusCode).toBe(403);
    });
});

describe("DELETE user", () => {
    test("it should output error if the access-token is not supplied", async () => {
        const response = await request(app)
        .delete(uriPrefix + "user")
        .set("x-access-token", "wrong token");
        expect(response.statusCode).toBe(403);
    });
});

describe("POST text", () => {
    test("it should output error if the access-token is not supplied", async () => {
        const response = await request(app)
        .post(uriPrefix + "user/text")
        .set("x-access-token", "wrong token");
        expect(response.statusCode).toBe(403);
    });
});

describe("GET text", () => {
    test("it should output error if the access-token is not supplied", async () => {
        const response = await request(app)
        .get(uriPrefix + "user/text")
        .set("x-access-token", "wrong token");
        expect(response.statusCode).toBe(403);
    });
});

describe("PUT text", () => {
    test("it should output error if the access-token is not supplied", async () => {
        const response = await request(app)
        .put(uriPrefix + "user/text")
        .set("x-access-token", "wrong token")
        .send({content: "test-text"});
        expect(response.statusCode).toBe(403);
    });
});

describe("DELETE text", () => {
    test("it should output error if the access-token is not supplied", async () => {
        const response = await request(app)
        .delete(uriPrefix + "user/text")
        .set("x-access-token", "wrong token");
        expect(response.statusCode).toBe(403);
    });
});