const router = require("express").Router();
const passport = require("passport");

const {
  registerSubscriber
} = require("../controllers/beneficiaries.controller");

router.get("/:id", registerSubscriber);

module.exports = router;
