const { db } = require("../dbConnection");
const request = require("supertest");
const { verifyTokenSync } = require("../services/auth_service");
const { testUsers } = require("../seeds/test_users");
const { adminUser } = require("../seeds/admin_user");
const app = require("../app");

describe("login", () => {
  test("successful login must get a valid token with (user) id", async () => {
    const user = await db
      .select("id")
      .from("users")
      .where({
        username: adminUser.username,
      })
      .first();

    const response = await request(app)
      .post("/auth/login")
      .send({ username: adminUser.username, password: adminUser.password })
      .expect(200);

    expect(response.body.token).not.toBeUndefined();

    try {
      const decoded = verifyTokenSync(response.body.token);
      expect(decoded.id).toEqual(user.id);
    } catch (err) {
      throw new Error("invalid token");
    }
  });

  test("empty username should not proceed with login", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ password: testUsers[0].password })
      .expect(400);

    expect(response.body.token).toBeUndefined();
  });

  test("empty password should not proceed with login", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ username: testUsers[0].username })
      .expect(400);

    expect(response.body.token).toBeUndefined();
  });

  test("non-matching username and password should not be logged-in", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ username: testUsers[0].username, password: "i_m_invalid" })
      .expect(401);

    expect(response.body.token).toBeUndefined();
  });
});

// jest hangs if there's an error with the arguments passed to supertest
