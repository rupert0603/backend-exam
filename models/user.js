class User {
  constructor(
    id,
    first_name,
    last_name,
    address,
    post_code,
    contact_phone_number,
    email,
    username,
    password,
    role,
    is_active
  ) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.address = address;
    this.post_code = post_code;
    this.contact_phone_number = contact_phone_number;
    this.email = email;
    this.username = username;
    this.password = password;
    this.role = role;
    this.is_active = is_active;
  }

  isAdmin() {
    return this.role === "ADMIN";
  }
}

module.exports = User;
