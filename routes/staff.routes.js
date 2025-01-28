const router = require("express").Router();
const passport = require("passport");

const {
  createStaff
} = require("../controllers/staff.controller");

router.post("", createStaff);

module.exports = router;
