const router = require('express').Router();
const passport = require('passport');
const multerOptions = require('../middlewares/multer-config');

const { fetchUserData } = require('../middlewares/fetch-user-data.middleware');
const { checkUserRole } = require('../middlewares/check-user-role.middleware');


const {
    getArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    getArticleById
} = require('../controllers/article.controller');

router.delete('/:id', deleteArticle);
router.put('/:id', multerOptions.single('coverImage'), updateArticle);
router.get('/:id', getArticleById);
router.get('', getArticles);
router.post('', multerOptions.single('coverImage'), createArticle);

/*
router.post('',passport.authenticate('jwt',{session:false}), multerOptions.single('coverImage'), createArticle);
router.put('/:id',passport.authenticate('jwt',{session:false}), multerOptions.single('coverImage'), updateArticle);
router.delete('/:id',passport.authenticate('jwt',{session:false}),fetchUserData , checkUserRole('Admin'), deleteArticle);

*/
module.exports = router;