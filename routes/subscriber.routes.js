const router = require('express').Router(); 

const { 
    assignSubscriberToGroup,
    getSubscribers,
    getSubscriberById,
    deleteSubscriber,
    validateSubscriber
 } = require('../controllers/subscribers.controller')

 router.put('/:subscriberId/assign-group/:groupId', assignSubscriberToGroup);
 router.put("/:id/validate", validateSubscriber);
 router.delete('/:id', deleteSubscriber);
 router.get('/:id', getSubscriberById);
 router.get('', getSubscribers);

module.exports = router;