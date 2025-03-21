const router = require("express").Router();
const passport = require("passport");

const {
  createStaffRequest,
  getStaffRequests
} = require("../controllers/staff-request.controller");

router.get('', getStaffRequests);
router.post('', createStaffRequest);

module.exports = router;
