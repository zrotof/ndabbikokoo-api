const router = require('express').Router(); 
const multerOptions = require('../middlewares/multer-config');

const passport = require("passport");

const { 
    createTestimony,
    deleteTestimony,
    getTestimonies,
    getTestimonyById,
    updateTestimony,
 } = require('../controllers/testimony.controller')


router.delete('/:id', deleteTestimony);
router.put('/:id', multerOptions.single('image'), updateTestimony);
router.get('/:id', getTestimonyById);
router.post('', multerOptions.single('image'), createTestimony);
router.get('', getTestimonies);

module.exports = router;