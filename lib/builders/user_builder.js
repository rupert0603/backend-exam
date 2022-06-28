const User = require("../../models/user");

class UserBuilder {
  constructor() {}

  withId(id) {
    this.id = id;
    return this;
  }

  withName(first_name, last_name) {
    this.first_name = first_name;
    this.last_name = last_name;
    return this;
  }

  withAddress(address, post_code) {
    this.address = address;
    this.post_code = post_code;
    return this;
  }

  withContact_number(contact_phone_number) {
    this.contact_phone_number = contact_phone_number;
    return this;
  }

  credentials(email, username, password) {
    this.email = email;
    this.username = username;
    this.password = password;
    return this;
  }
  withRole(role) {
    this.role = role;
    return this;
  }

  withActiveStatus(is_active) {
    this.is_active = is_active;
    return this;
  }

  build() {
    return new User(
      this.id,
      this.first_name,
      this.last_name,
      this.address,
      this.post_code,
      this.contact_phone_number,
      this.email,
      this.username,
      this.password,
      this.role,
      this.is_active
    );
  }
}

module.exports = UserBuilder;
