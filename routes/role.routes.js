const router = require('express').Router(); 

const { 
    getRoles,
    createRole,
    updateRole,
    deleteRole
 } = require('../controllers/roles.controller')

router.get('', getRoles);
router.post('', createRole);
router.put('/:id', updateRole)
router.delete('/:id', deleteRole)

module.exports = router;