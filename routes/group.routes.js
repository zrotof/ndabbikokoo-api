const router = require('express').Router(); 

const { 
    getGroups,
    getGroupById,
    createGroup,
    updateGroup,
    deleteGroup
 } = require('../controllers/groups.controller')

router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);
router.get('/:id', getGroupById);
router.get('', getGroups);
router.post('', createGroup);

module.exports = router;