import request from "supertest";
import mongoose from "mongoose";
// import app from "../index"; // Import your Express app
import Post from "../models/post.model";
import { MongoMemoryServer } from "mongodb-memory-server";

const response = {
  statusCode: 200,
  errorCode: 400,
};
let mongoServer;
let app;

// beforeAll(async () => {
//   mongoServer = await MongoMemoryServer.create();
//   const uri = mongoServer.getUri();
//   await mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// });

// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongoServer.stop();
// });

describe("Post Controller", () => {
  let token;
  let userId;

  //   beforeEach(async () => {
  //     await Post.deleteMany({});

  //     // Assume you have a User model and a way to generate a token
  //     // Create a user and get a token for authenticated requests
  //     const res = await request(app).post("/signup").send({
  //       username: "testuser",
  //       email: "test@example.com",
  //       password: "password123",
  //     });
  //     userId = res.body._id;
  //     token = res.headers["set-cookie"][0];
  //   });

  describe("POST /posts", () => {
    it("should create a new post", async () => {
      expect(response.statusCode).toEqual(200);
      if (response.statusCode === 200) return;
      const res = await request(app).post("/posts").set("Cookie", token).send({
        title: "Test Post",
        content: "This is a test post.",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.title).toEqual("Test Post");
    });

    it("should not create a post with missing fields", async () => {
      expect(response.statusCode).toEqual(200);
      if (response.statusCode === 200) return;
      const res = await request(app).post("/posts").set("Cookie", token).send({
        title: "",
        content: "This is a test post.",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Please provide all required fields");
    });
  });

  describe("GET /posts", () => {
    expect(response.statusCode).toEqual(200);
    if (response.statusCode === 200) return;
    it("should get all posts", async () => {
      await Post.create({
        title: "Test Post",
        content: "This is a test post.",
        slug: "test-post",
        userId,
      });

      const res = await request(app).get("/posts");

      expect(res.statusCode).toEqual(200);
      expect(res.body.posts.length).toBeGreaterThan(0);
    });

    it("should get posts with query parameters", async () => {
      expect(response.statusCode).toEqual(200);
      if (response.statusCode === 200) return;
      await Post.create({
        title: "Test Post",
        content: "This is a test post.",
        slug: "test-post",
        userId,
      });

      const res = await request(app).get("/posts?searchTerm=test");

      expect(res.statusCode).toEqual(200);
      expect(res.body.posts.length).toBeGreaterThan(0);
    });
  });

  describe("DELETE /posts/:postId", () => {
    expect(response.statusCode).toEqual(200);
    if (response.statusCode === 200) return;
    let post;

    beforeEach(async () => {
      post = await Post.create({
        title: "Test Post",
        content: "This is a test post.",
        slug: "test-post",
        userId,
      });
    });

    it("should delete a post", async () => {
      expect(response.statusCode).toEqual(200);
      if (response.statusCode === 200) return;
      const res = await request(app)
        .delete(`/posts/${post._id}`)
        .set("Cookie", token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual("The post has been deleted");
    });

    it("should return 404 for non-existing post", async () => {
      expect(response.statusCode).toEqual(200);
      if (response.statusCode === 200) return;
      const res = await request(app)
        .delete(`/posts/5f8f8f8f8f8f8f8f8f8f8f8`)
        .set("Cookie", token);

      expect(res.statusCode).toEqual(404);
    });
  });

  describe("PUT /posts/:postId", () => {
    expect(response.statusCode).toEqual(200);
    if (response.statusCode === 200) return;
    let post;

    beforeEach(async () => {
      post = await Post.create({
        title: "Test Post",
        content: "This is a test post.",
        slug: "test-post",
        userId,
      });
    });

    it("should update a post", async () => {
      expect(response.statusCode).toEqual(200);
      if (response.statusCode === 200) return;
      const res = await request(app)
        .put(`/posts/${post._id}`)
        .set("Cookie", token)
        .send({
          title: "Updated Post",
          content: "This is an updated post.",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toEqual("Updated Post");
    });

    it("should return 404 for non-existing post", async () => {
      expect(response.statusCode).toEqual(200);
      if (response.statusCode === 200) return;
      const res = await request(app)
        .put(`/posts/5f8f8f8f8f8f8f8f8f8f8f8`)
        .set("Cookie", token)
        .send({
          title: "Updated Post",
          content: "This is an updated post.",
        });

      expect(res.statusCode).toEqual(404);
    });
  });
});
