const router = require("express").Router();
const passport = require("passport");

const {
    registerSubscriber,
    loginSubscriber,
    isTokenValid
} = require("../controllers/auth.controller");

router.post("/register-subscriber", registerSubscriber);
router.post("/login-subscriber", loginSubscriber);
router.post("/validate-token", isTokenValid);

module.exports = router;
