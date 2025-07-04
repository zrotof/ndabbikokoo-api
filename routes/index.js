const router = require('express').Router();

const articleRoute = require('./article.routes');
const authRoutes = require('./auth.routes');
const beneficiaryRoutes = require('./beneficiary.routes');
const familyRoutes = require('./family.routes');
const groupRoutes = require('./group.routes');
const roleRoutes = require('./role.routes');
const rubricRoute = require('./article-rubric.routes');
const phoneRegisterRoute = require('./phone-register.routes');
const plannerRoute = require('./planner.routes');
const staffRequestRoute = require('./staff-request.routes');
const staffRoute = require('./staff.routes');
const subscriberRoutes = require('./subscriber.routes');
const userRoutes = require('./user.routes');
const testimonyRoutes = require('./testimony.routes');

router.use("/auth", authRoutes);
router.use("/blog/articles", articleRoute);
router.use("/beneficiaries", beneficiaryRoutes);
router.use("/families", familyRoutes);
router.use("/groups", groupRoutes);
router.use("/roles", roleRoutes);
router.use("/blog/rubrics", rubricRoute);
router.use("/planners", plannerRoute);
router.use("/phone-registers", phoneRegisterRoute);
router.use("/testimonies", testimonyRoutes);
router.use('/staffs-requests', staffRequestRoute);
router.use("/staffs", staffRoute);
router.use("/subscribers", subscriberRoutes);
router.use("/users", userRoutes);

module.exports = router;