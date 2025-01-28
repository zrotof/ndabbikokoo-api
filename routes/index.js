const router = require('express').Router();

const familyRoutes = require('./family.routes');
const groupRoutes = require('./group.routes');
const roleRoutes = require('./role.routes');
const subscriberRoutes = require('./subscriber.routes');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const beneficiaryRoutes = require('./beneficiary.routes');
const staffRoutes = require('./staff.routes');

router.use("/families", familyRoutes);
router.use("/groups", groupRoutes);
router.use("/roles", roleRoutes);
router.use("/subscribers", subscriberRoutes)
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/beneficiaries", beneficiaryRoutes)
router.use("/staff", staffRoutes)

module.exports = router;