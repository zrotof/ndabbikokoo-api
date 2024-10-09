const router = require('express').Router(); 

router.get('', (req, res, next) => {
    console.log("Test route accessed");
    res.send("Test route accessed")
})

module.exports = router;