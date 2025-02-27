const router = require('express').Router(); 
const multerOptions = require('../middlewares/multer-config');

const { 
    assignSubscriberToGroup,
    getSubscribers,
    getSubscriberById,
    editSubscriberById,
    deleteSubscriber,
    validateSubscriber,
    idRequest,
    identification,
    editBeneficiary,
    getSubscriberFamily,
    registerSubscriberFamilyMember,
    editSubscriberFamilyMember,
    deleteSubscriberFamilyMember,
    editSubscriberProfile
 } = require('../controllers/subscribers.controller')

 router.put('/:subscriberId/assign-group/:groupId', assignSubscriberToGroup);
 router.put('/:subscriberId/beneficiaries/:beneficiaryId', editBeneficiary);
 router.put('/:id/profile/', multerOptions.single('image'), editSubscriberProfile);
 router.put('/:id/families/:familyMemberId', editSubscriberFamilyMember);
 router.put("/:id/validate", validateSubscriber);
 router.put('/:id', editSubscriberById);
 router.post("/:id/identification",multerOptions.array('files', 5), identification);
 router.post("/:id/id-request", idRequest);
 router.post("/:id/families", registerSubscriberFamilyMember);
 router.delete('/:id', deleteSubscriber);
 router.delete('/:id/families/:familyMemberId', deleteSubscriberFamilyMember);
 router.get('/:id/families', getSubscriberFamily);
 router.get('/:id', getSubscriberById);
 router.get('', getSubscribers);

module.exports = router;