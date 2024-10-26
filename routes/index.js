const router = require('express').Router();

const userRoutes = require('./user.routes');
const roleRoutes = require('./role.routes');

router.use("/roles", roleRoutes);
router.use("/users", userRoutes)

module.exports = router;