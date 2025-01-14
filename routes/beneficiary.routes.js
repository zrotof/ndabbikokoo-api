const router = require("express").Router();
const passport = require("passport");

const {
  registerBeneficiary,
  getBeneficiaryBySubscriberId
} = require("../controllers/beneficiaries.controller");

router.post("", registerBeneficiary);
router.get("/:id", getBeneficiaryBySubscriberId);

module.exports = router;
