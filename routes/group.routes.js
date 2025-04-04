const router = require('express').Router(); 
const passport = require("passport");

const { 
    getGroups,
    getGroupById,
    createGroup,
    updateGroup,
    deleteGroup,
    getGroupMembersByGroupId,
    getGroupWithMembersByGroupId
 } = require('../controllers/groups.controller')

router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);
router.get('/:id/members', getGroupMembersByGroupId);
router.get('/:id/all', getGroupWithMembersByGroupId);
router.get('/:id', getGroupById);
router.post('', createGroup);
router.get('', passport.authenticate("staff-jwt", { session: false }), getGroups);

module.exports = router;