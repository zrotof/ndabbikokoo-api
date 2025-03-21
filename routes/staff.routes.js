const router = require("express").Router();
const passport = require("passport");

const {
  createStaff,
  getStaffs,
  retrieveConnectedStaff,
  assignStaffToGroup
} = require("../controllers/staff.controller");

router.post('/:staffId/assign-group', assignStaffToGroup);
router.post("", createStaff);
router.get(
  "/me",
  passport.authenticate("staff-jwt", { session: false }),
  retrieveConnectedStaff
);
router.get("", getStaffs);

module.exports = router;
