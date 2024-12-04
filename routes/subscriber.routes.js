const router = require('express').Router(); 

const { 
    getSubscribers,
    createSubscriber,
    deleteSubscriber
 } = require('../controllers/subscribers.controller')

 router.delete('/:id', deleteSubscriber);
 router.post('', createSubscriber);
 router.get('', getSubscribers);

module.exports = router;