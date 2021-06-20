import request from "supertest";
import app from "../server.js";
import { jest } from "@jest/globals"
import { redirectToHomeIfAuth } from "../middleware/session-authorize.js";
import { registerUser } from "../middleware/register.js";
import { DBConnection } from "../util/db-connection.js";

describe("GET /login: Test login route", () => {
	test("It should get the login screen", (done) => {
		request(app)
			.get("/login", redirectToHomeIfAuth)
			.then((response) => {
				expect(response.statusCode).toBe(200);
				done();
			});
	});
});


describe("POST /login: Test user login", () => {
	test("It should not login if user data is invalid", async () => {
		await request(app)
			.post("/login", redirectToHomeIfAuth).send({
				username: "xxx",
				password: "xxx"
			})
			.expect(302)
			.expect('Location', './login')
	});

	test("It should login if user data is valid", async () => {
		await request(app).post("/login", redirectToHomeIfAuth).type('form').send({
			username: "test",
			password: "test"
		})
			.expect(302)
			.expect('Location', '/')
	});
});

describe("GET /register: Test register route", () => {
	test("It should get the register screen", (done) => {
		request(app)
			.get("/register", redirectToHomeIfAuth)
			.then((response) => {
				expect(response.statusCode).toBe(200);
				done();
			});
	});
});


describe("POST /register: Register Redirect", () => {
	test("It should redirect after registering", async () => {
		await request(app).post("/register", redirectToHomeIfAuth, registerUser).type('form').send({
			username: "TESTING1",
			password: "TESTING1"
		})
			.expect(302)
			.expect('Location', './')
	});

	test("It should redirect after registering already registered user", async () => {
		await request(app).post("/register", redirectToHomeIfAuth, registerUser).type('form').send({
			username: "TESTING1",
			password: "TESTING1"
		})
			.expect(302)
			.expect('Location', '/register')
	});

});
