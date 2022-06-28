const express = require("express");
const router = express.Router();
const {
  addUser,
  editOneUser,
  deleteOneUser,
  getUsers,
  deleteUsers,
} = require("../controllers/user_controller");
const {
  protectRoute,
  restrictRouteTo,
} = require("../middlewares/auth_middlewares");

router.get("/", protectRoute, restrictRouteTo("ADMIN"), getUsers);
router.post("/", protectRoute, restrictRouteTo("ADMIN"), addUser);
router.delete("/", protectRoute, restrictRouteTo("ADMIN"), deleteUsers);
router.patch("/:id", protectRoute, restrictRouteTo("ADMIN"), editOneUser);
router.delete("/:id", protectRoute, restrictRouteTo("ADMIN"), deleteOneUser);

module.exports = router;
