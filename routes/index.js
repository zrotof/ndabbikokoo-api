const router = require('express').Router();

const groupRoutes = require('./group.routes');
const roleRoutes = require('./role.routes');
const subscriberRoutes = require('./subscriber.routes');
const userRoutes = require('./user.routes');

router.use("/groups", groupRoutes);
router.use("/roles", roleRoutes);
router.use("/subscribers", subscriberRoutes)
router.use("/users", userRoutes);

module.exports = router;