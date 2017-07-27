var express	= require('express');
var router 	= express.Router();
var port 	= process.env.PORT || 3000;

// include controllers
var rec = require('../controllers/api/recovery');

//route for recovery
router.get('/get/recovery-question', rec.getRecoveryQuestion);
router.post('/save-recovery-option', rec.setRecoveryOption);
router.post('/list-recovery-question', rec.listRecoveryQuestion);

module.exports = router;
