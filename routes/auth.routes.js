const router = require("express").Router();
const passport = require("passport");

const {
    registerSubscriber,
    loginSubscriber
} = require("../controllers/auth.controller");

router.post("/register-subscriber", registerSubscriber);
router.post("/login-subscriber", loginSubscriber);

module.exports = router;
