const router = require('express').Router();

const articleRoute = require('./article.routes');
const authRoutes = require('./auth.routes');
const beneficiaryRoutes = require('./beneficiary.routes');
const familyRoutes = require('./family.routes');
const groupRoutes = require('./group.routes');
const roleRoutes = require('./role.routes');
const rubricRoute = require('./article-rubric.routes');
const staffRequestRoute = require('./staff-request.routes');
const staffRoute = require('./staff.routes');
const subscriberRoutes = require('./subscriber.routes');
const userRoutes = require('./user.routes');


router.use("/auth", authRoutes);
router.use("/articles", articleRoute);
router.use("/beneficiaries", beneficiaryRoutes);
router.use("/families", familyRoutes);
router.use("/groups", groupRoutes);
router.use("/roles", roleRoutes);
router.use("/rubrics", rubricRoute);
router.use('/staffs-requests', staffRequestRoute);
router.use("/staffs", staffRoute);
router.use("/subscribers", subscriberRoutes)
router.use("/users", userRoutes);

module.exports = router;