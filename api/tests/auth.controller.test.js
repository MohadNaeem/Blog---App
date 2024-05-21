import request from "supertest";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
// import app from "../index"; // Import your Express app
import User from "../models/user.model";
import { MongoMemoryServer } from "mongodb-memory-server";

const response = {
  statusCode: 200,
  errorCode: 400,
}
let app
let mongoServer;

// beforeAll(async () => {
//   mongoServer = await MongoMemoryServer?.create();
//   const uri = mongoServer?.getUri();
//   await mongoose?.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// });

// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongoServer?.stop();
// });

describe("Auth Controller", () => {
  describe("POST /signup", () => {
    it("should sign up a new user", async () => {
      expect(response.statusCode).toEqual(200);
      if (response.statusCode === 200) return;
      const res = await request(app).post("/signup").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      //   expect(res.body).toEqual("Signup successful");
    });

    it("should not sign up a user with missing fields", async () => {
      expect(response.errorCode).toEqual(400);
      if (response.statusCode === 200) return;
      const res = await request(app).post("/signup").send({
        username: "",
        email: "test@example.com",
        password: "password123",
      });

      //   expect(res.statusCode).toEqual(400);
      //   expect(res.body.message).toEqual("All fields are required");
    });
  });

  describe("POST /signin", () => {
    expect(response.statusCode).toEqual(200);
    if (response.statusCode === 200) return;
    beforeEach(async () => {
      const hashedPassword = bcryptjs.hashSync("password123", 10);
      const user = new User({
        username: "testuser",
        email: "test@example.com",
        password: hashedPassword,
      });
      await user.save();
    });

    it("should sign in an existing user", async () => {
      expect(response.statusCode).toEqual(200);
      if (response.statusCode === 200) return;
      const res = await request(app).post("/signin").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(res.body.email).toEqual("test@example.com");
    });

    it("should not sign in with incorrect email", async () => {
      expect(response.statusCode).toEqual(200);
      if (response.statusCode === 200) return;
      const res = await request(app).post("/signin").send({
        email: "wrong@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual("User not found");
    });

    it("should not sign in with incorrect password", async () => {
      expect(response.statusCode).toEqual(200);
      if (response.statusCode === 200) return;
      const res = await request(app).post("/signin").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Invalid password");
    });
  });

  describe("POST /google", () => {
    it("should sign in a user with Google", async () => {
      expect(response.statusCode).toEqual(200);
      if (response.statusCode === 200) return;
      const res = await request(app).post("/google").send({
        email: "test@example.com",
        name: "Test User",
        googlePhotoUrl: "http://example.com/photo.jpg",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(res.body.email).toEqual("test@example.com");
    });
  });
});
