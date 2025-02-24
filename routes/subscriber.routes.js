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
    identification
 } = require('../controllers/subscribers.controller')

 router.put('/:subscriberId/assign-group/:groupId', assignSubscriberToGroup);
 router.put("/:id/validate", validateSubscriber);
 router.post("/:id/identification",multerOptions.array('files', 5) , identification);
 router.post("/:id/id-request", idRequest);
 router.put('/:id', editSubscriberById);
 router.delete('/:id', deleteSubscriber);
 router.get('/:id', getSubscriberById);
 router.get('', getSubscribers);

module.exports = router;