const router = require("express").Router();
const passport = require("passport");

const {
  getUsers,
  getUserById,
  retrieveConnectedUser,
  createUser,
  updateUser,
  deleteUser,
  verifyEmail,
  initPasswordReset,
  askEmailVerification,
  loginUser,
  resetPassword,
  validateSubscriber,
} = require("../controllers/users.controller");

router.post("", createUser);
router.patch("/:id/validate", validateSubscriber);
router.put("/:id", updateUser);
router.post("/login", loginUser);
router.delete("/:id", deleteUser);
router.get("/verify-email", verifyEmail);
router.get("/ask-email-verification", askEmailVerification);
router.post("/init-password-reset", initPasswordReset);
router.post('/reset-password', passport.authenticate('jwt',{session:false}), resetPassword);
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  retrieveConnectedUser
);
router.get("/:id", getUserById);
router.get("", getUsers);

module.exports = router;
