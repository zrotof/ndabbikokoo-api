const router = require('express').Router();
const passport = require('passport');
const multerOptions = require('../middlewares/multer-config');

const { fetchUserData } = require('../middlewares/fetch-user-data.middleware');
const { checkUserRole } = require('../middlewares/check-user-role.middleware');


const {
    getPlanners,
    getPlannerTypes,
    createPlanner,
    updatePlanner,
    deletePlanner,
    getPlannerById
} = require('../controllers/planner.controller');

router.delete('/:id', deletePlanner);
router.put('/:id', multerOptions.single('coverImage'), updatePlanner);
router.get('/types', getPlannerTypes);
router.get('/:id', getPlannerById);
router.get('', getPlanners);
router.post('', multerOptions.single('coverImage'), createPlanner);

/*
router.post('',passport.authenticate('jwt',{session:false}), multerOptions.single('coverImage'), createArticle);
router.put('/:id',passport.authenticate('jwt',{session:false}), multerOptions.single('coverImage'), updateArticle);
router.delete('/:id',passport.authenticate('jwt',{session:false}),fetchUserData , checkUserRole('Admin'), deleteArticle);

*/
module.exports = router;