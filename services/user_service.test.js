const { createEditUserObject } = require("./user_service");
const { db } = require("../dbConnection");
const UserBuilder = require("../lib/builders/user_builder");

describe("createEditUserObject", () => {
  const user = new UserBuilder()
    .withId(90)
    .withName("john", "doe")
    .withAddress("Binondo, Manila", "1008")
    .withContact_number("09239999999")
    .credentials("my_email@gmail.com", "myUsername", "myPassword")
    .withRole("USER")
    .withActiveStatus(1)
    .build();

  const filteredUserData = createEditUserObject(user, db.fn.now());

  test("must not contain id", () => {
    expect(filteredUserData.id).toEqual(undefined);
  });

  test("must not contain password", () => {
    expect(filteredUserData.password).toEqual(undefined);
  });

  test("must not contain username", () => {
    expect(filteredUserData.username).toEqual(undefined);
  });

  test("must not contain email", () => {
    expect(filteredUserData.email).toEqual(undefined);
  });

  test("must contain valid properties", () => {
    expect(filteredUserData.first_name).not.toEqual(undefined);
    expect(filteredUserData.last_name).not.toEqual(undefined);
    expect(filteredUserData.address).not.toEqual(undefined);
    expect(filteredUserData.post_code).not.toEqual(undefined);
    expect(filteredUserData.contact_phone_number).not.toEqual(undefined);
    expect(filteredUserData.role).not.toEqual(undefined);
    expect(filteredUserData.is_active).not.toEqual(undefined);
  });
});
