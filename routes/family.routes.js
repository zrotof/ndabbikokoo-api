const router = require("express").Router();
const passport = require("passport");

const {
  getFamilyMembersBySubscriberId
} = require("../controllers/family.controller");

router.get("/:id", getFamilyMembersBySubscriberId);

module.exports = router;
