const { db } = require("../dbConnection");
const { protectRoute, restrictRouteTo } = require("./auth_middlewares");
const request = require("supertest");
const { hashPassword } = require("../services/auth_service");
const app = require("../app");

beforeAll(() => {
  res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  next = jest.fn();
});

afterEach(() => {
  res.status.mockClear();
  res.json.mockClear();
  next.mockClear();
});

describe("protectRoute", () => {
  test("users without missing token should not be able to proceed", async () => {
    const req = {
      headers: {
        authorization: null,
      },
    };
    await protectRoute(req, res, next);

    expect(res.status.mock.calls[0][0]).toBe(401);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("users with invalid token token should not be able to proceed", async () => {
    const req = {
      headers: {
        authorization: "invalid",
      },
    };
    await protectRoute(req, res, next);

    expect(res.status.mock.calls[0][0]).toBe(401);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("active users with valid token should be able to proceed", async () => {
    const newUser = {
      first_name: "Spencer",
      last_name: "George",
      address: "223 Chardonnay Drive",
      post_code: "98161",
      contact_phone_number: "206-563-5326",
      email: "igoreklyps@sitikkkk.site",
      username: "beaver",
      password: "Idb!$n@mFanD",
      role: "ADMIN",
      is_active: 1,
    };

    const hashedPassword = await hashPassword(newUser.password);

    await db("users").insert({
      ...newUser,
      password: hashedPassword,
    });

    const userLogin = await request(app)
      .post("/auth/login")
      .send({ username: newUser.username, password: newUser.password });

    const req = {
      headers: {
        authorization: "Bearer " + userLogin.body.token,
      },
    };

    await protectRoute(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});

describe("restrictRouteTo", () => {
  test("users should not be able to access routes for admin role", async () => {
    const middlewareSUT = restrictRouteTo("ADMIN");
    const user = await db
      .select(
        "id",
        "first_name",
        "last_name",
        "address",
        "post_code",
        "contact_phone_number",
        "email",
        "username",
        "role"
      )
      .from("users")
      .where({ role: "USER" })
      .first();

    const req = {
      user,
    };

    await middlewareSUT(req, res, next);

    expect(res.status.mock.calls[0][0]).toBe(403);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
