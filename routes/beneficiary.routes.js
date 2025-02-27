const router = require("express").Router();
const passport = require("passport");

const {
  registerBeneficiary,
  getBeneficiaryBySubscriberId,
  deleteBeneficiary
} = require("../controllers/beneficiaries.controller");

router.delete("/:id", deleteBeneficiary);
router.post("", registerBeneficiary);
router.get("/:id", getBeneficiaryBySubscriberId);

module.exports = router;
