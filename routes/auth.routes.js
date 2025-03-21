const router = require("express").Router();
const passport = require("passport");

const {
    registerSubscriber,
    loginSubscriber,
    loginStaff,
    isTokenValid,
    logout
} = require("../controllers/auth.controller");

router.post("/register-subscriber", registerSubscriber);
router.post("/login-subscriber", loginSubscriber);
router.post("/login-staff", loginStaff);
router.post("/validate-token", isTokenValid);
router.post("/logout", logout);

module.exports = router;
