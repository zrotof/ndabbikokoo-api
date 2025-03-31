const router = require("express").Router();
const passport = require("passport");

const {
  createStaff,
  getStaffs,
  retrieveConnectedStaff,
  assignStaffToGroup,
  assignGroupsToDelegate,
  getStaffGroupsById,
  getDeputyGroupsById
} = require("../controllers/staff.controller");

router.post('/:staffId/assign-group', assignGroupsToDelegate);
router.get('/:staffId/groups-assigned', getDeputyGroupsById);
router.get('/:staffId/groups', getStaffGroupsById);
router.post("", createStaff);
router.get(
  "/me",
  passport.authenticate("staff-jwt", { session: false }),
  retrieveConnectedStaff
);
router.get("", getStaffs);

module.exports = router;
