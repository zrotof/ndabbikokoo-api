const router = require('express').Router();
const passport = require("passport");

const {
    getPhoneRegisters,
    createPhoneRegister
} = require('../controllers/phone-registers.controller')

router.get('', getPhoneRegisters);
router.post('', createPhoneRegister);

module.exports = router;