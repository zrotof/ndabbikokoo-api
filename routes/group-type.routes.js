const router = require('express').Router(); 

const { 
    getGroupTypes,
 } = require('../controllers/group-types.controller')

router.get('', getGroupTypes);

module.exports = router;