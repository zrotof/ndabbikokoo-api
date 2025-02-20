const router = require('express').Router(); 
const passport = require('passport');

const { fetchUserData } = require('../middlewares/fetch-user-data.middleware');
const { checkUserRole } = require('../middlewares/check-user-role.middleware');

const { 
    getRubrics, 
    createRubric, 
    updateRubric, 
    deleteRubricById,
    getRubricById,
    updateArtcleRubricListOrder
} = require('../controllers/article-rubric.controller');   

router.put('/update-article-rubric-list-order', updateArtcleRubricListOrder);
router.put('/:id', updateRubric); 
router.delete('/:id', deleteRubricById);
router.get('/:id', getRubricById); 
router.post('', createRubric); 
router.get('', getRubrics); 

/*
router.put('/update-article-rubric-list-order',passport.authenticate('jwt',{session:false}), updateArtcleRubricListOrder);
router.post('',passport.authenticate('jwt',{session:false}), createRubric); 
router.put('/:id',passport.authenticate('jwt',{session:false}), updateRubric); 
router.delete('/:id',passport.authenticate('jwt',{session:false}),fetchUserData , checkUserRole('Admin'), deleteRubric);

*/

module.exports = router; 
