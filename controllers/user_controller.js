const { hashPassword } = require("../services/auth_service");
const UserBuilder = require("../lib/builders/user_builder");
const { db } = require("../dbConnection");
const { createEditUserObject } = require("../services/user_service");

exports.addUser = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      address,
      post_code,
      contact_phone_number,
      email,
      username,
      password,
      role,
    } = req.body;

    const existingUser = await db
      .select("username", "email")
      .from("users")
      .where({
        email: email,
      })
      .orWhere({
        username: username,
      })
      .first();

    if (existingUser) {
      return res
        .status(409)
        .json({ status: "FAILED", message: "Account already exists." });
    }

    const newUser = new UserBuilder()
      .withName(first_name, last_name)
      .withAddress(address, post_code)
      .withContact_number(contact_phone_number)
      .credentials(email, username, password)
      .withRole(role)
      .withActiveStatus(true)
      .build();

    newUser.password = await hashPassword(password);

    await db("users").insert(newUser);

    return res
      .status(201)
      .json({ status: "SUCCESS", message: "User successfully created." });
  } catch (err) {
    return res.status(500).json({
      status: "FAILED",
      message: "Server error. Please try again later.",
    });
  }
};

exports.editOneUser = async (req, res, next) => {
  try {
    const numId = Number(req.params.id);

    if (!req.body || isNaN(numId)) {
      return res.status(400).json({
        status: "FAILED",
        message: "Please enter correct details.",
      });
    }

    // email, id, password, and username must not be edited
    const filteredDetails = createEditUserObject(req.body, db.fn.now());

    await db("users").where("id", "=", numId).update(filteredDetails);

    return res.status(200).json({
      status: "SUCCESS",
      message: "Successfully updated user.",
    });
  } catch (err) {
    return res.status(500).json({
      status: "FAILED",
      message: "Server error. Please try again later.",
    });
  }
};

exports.deleteOneUser = async (req, res, next) => {
  try {
    const numId = Number(req.params.id);

    if (isNaN(numId)) {
      return res.status(400).json({
        status: "FAILED",
        message: "Please enter correct details.",
      });
    }

    // await db("users").where("id", "=", req.params.id).update({ is_active: 0 });
    await db("users").where("id", "=", req.params.id).del();

    return res.status(200).json({
      status: "SUCCESS",
      message: "Successfully deleted user.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "FAILED",
      message: "Server error. Please try again later.",
    });
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await db
      .select(
        "id",
        "first_name",
        "last_name",
        "address",
        "post_code",
        "contact_phone_number",
        "email",
        "username",
        "role",
        "is_active"
      )
      .from("users");

    return res.status(200).json({
      status: "SUCCESS",
      message: "Successfully fetched users.",
      data: { users },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "FAILED",
      message: "Server error. Please try again later.",
    });
  }
};

exports.deleteUsers = async (req, res, next) => {
  try {
    // const userIds = parseToArray(req.body.userIds);

    await db("users").delete().whereIn("id", req.body.userIds);

    return res.status(200).json({
      status: "SUCCESS",
      message: "Successfully deleted users.",
    });
  } catch (err) {
    console.error(err);

    if (err.message === "Invalid array conversion") {
      return res.status(400).json({
        status: "FAILED",
        message: "Please use the right data",
      });
    }

    return res.status(500).json({
      status: "FAILED",
      message: "Server error. Please try again later.",
    });
  }
};
