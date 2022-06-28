const { signToken, verifyTokenSync } = require("./auth_service");

test("jwt should have (user's) id", () => {
  const id = 40;
  const token = signToken(id);

  const decoded = verifyTokenSync(token);

  expect(decoded.id).toBe(id);
});
