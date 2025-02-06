const router = require('express').Router(); 

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
router.get('', getGroups);
router.post('', createGroup);

module.exports = router;