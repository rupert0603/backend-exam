const { db } = require("../dbConnection");
const request = require("supertest");
const { testUsers } = require("../seeds/test_users");
const { adminUser } = require("../seeds/admin_user");
const app = require("../app");
const { isPasswordCorrect } = require("../services/auth_service");

beforeEach(async () => {
  adminUserLogin = await request(app)
    .post("/auth/login")
    .send({ username: adminUser.username, password: adminUser.password });
});

describe("addUser", () => {
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

  test("successfully add new user", async () => {
    await request(app)
      .post("/users")
      .send(newUser)
      .set("Authorization", `Bearer ${adminUserLogin.body.token}`)
      .expect(201);

    const user = await db
      .select("username", "password")
      .from("users")
      .where({
        username: newUser.username,
      })
      .first();

    expect(user).not.toBeNull();

    const isPWCorrect = await isPasswordCorrect(
      newUser.password,
      user.password
    );

    expect(isPWCorrect).toBe(true);
  });

  test("new user's email must not exist in the database", async () => {
    const userSUT = {
      ...testUsers[1],
    };

    const invalidEmailUser = {
      ...newUser,
      email: userSUT.email,
    };

    await request(app)
      .post("/users")
      .send(invalidEmailUser)
      .set("Authorization", `Bearer ${adminUserLogin.body.token}`)
      .expect(409);
  });

  test("new user's username must not exist in the database", async () => {
    const userSUT = {
      ...testUsers[1],
    };

    const invalidEmailUser = {
      ...newUser,
      username: userSUT.username,
    };

    await request(app)
      .post("/users")
      .send(invalidEmailUser)
      .set("Authorization", `Bearer ${adminUserLogin.body.token}`)
      .expect(409);
  });

  test("must not be accessed by ordinary users", async () => {
    const userSUT = {
      ...testUsers[1],
    };

    const userLogin = await request(app).post("/auth/login").send({
      username: userSUT.username,
      password: userSUT.password,
    });

    const response = await request(app)
      .post("/users")
      .send(newUser)
      .set("Authorization", `Bearer ${userLogin.body.token}`)
      .expect(403);
  });
});

describe("editOneUser", () => {
  const newDetails = {
    first_name: "Spencer",
    last_name: "George",
    address: "223 Chardonnay Drive",
    post_code: "98161",
    contact_phone_number: "206-563-5326",
    email: "igoreklyps@sitikkkk.site",
    username: "beaver",
    password: "Idb!$n@mFanD",
    role: "ADMIN",
    is_active: 0,
  };

  test("successfully edit user details except for id, username, password, and email", async () => {
    const userSUT = {
      ...testUsers[0],
    };

    const testUserInitialDbData = await db
      .select("id", "password", "email")
      .from("users")
      .where("username", "=", userSUT.username)
      .first();

    await request(app)
      .patch(`/users/${testUserInitialDbData.id}`)
      .send(newDetails)
      .set("Authorization", `Bearer ${adminUserLogin.body.token}`)
      .expect(200);

    const updatedTestUserDbData = await db
      .select("*")
      .from("users")
      .where("username", "=", userSUT.username)
      .first();

    // should still have the old details
    expect(updatedTestUserDbData.id).toEqual(testUserInitialDbData.id);
    expect(updatedTestUserDbData.password).toEqual(
      testUserInitialDbData.password
    );
    expect(updatedTestUserDbData.email).toEqual(testUserInitialDbData.email);

    // should already be updated
    expect(updatedTestUserDbData.first_name).toEqual(newDetails.first_name);
    expect(updatedTestUserDbData.last_name).toEqual(newDetails.last_name);
    expect(updatedTestUserDbData.address).toEqual(newDetails.address);
    expect(updatedTestUserDbData.post_code).toEqual(newDetails.post_code);
    expect(updatedTestUserDbData.contact_phone_number).toEqual(
      newDetails.contact_phone_number
    );
    expect(updatedTestUserDbData.role).toEqual(newDetails.role);
    expect(updatedTestUserDbData.is_active).toEqual(newDetails.is_active);
  });
});

describe("deleteOneUser", () => {
  test("successfully delete one user", async () => {
    const userSUT = {
      ...testUsers[3],
    };

    const userDbData = await db
      .select("id")
      .from("users")
      .where("username", "=", userSUT.username)
      .first();

    await request(app)
      .delete(`/users/${userDbData.id}`)
      .set("Authorization", `Bearer ${adminUserLogin.body.token}`)
      .expect(200);

    const updatedDbData = await db
      .select("id")
      .from("users")
      .where("id", "=", userDbData.id)
      .first();

    expect(updatedDbData).toEqual(undefined);
  });
});

describe("getUsers", () => {
  test("successfully fetch all users", async () => {
    const usersDbData = await db.select("id").from("users");

    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminUserLogin.body.token}`)
      .expect(200);

    expect(usersDbData.length).toBe(response.body.data.users.length);
  });
});

describe("deleteUsers", () => {
  test("successfully delete users", async () => {
    const userSUT1 = {
      ...testUsers[2],
    };

    const userSUT2 = {
      ...testUsers[3],
    };

    const userIds = await db.union([
      db.select("id").from("users").where("username", "=", userSUT1.username),
      db.select("id").from("users").where("username", "=", userSUT2.username),
    ]);

    await request(app)
      .delete("/users")
      .set("Authorization", `Bearer ${adminUserLogin.body.token}`)
      .send({
        userIds: userIds.map((userId) => userId.id),
      })
      .expect(200);

    const deletedUserIds = await db.union([
      db.select("id").from("users").where("username", "=", userSUT1.username),
      db.select("id").from("users").where("username", "=", userSUT2.username),
    ]);

    expect(deletedUserIds).toEqual([]);
  });
});
