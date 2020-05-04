const express = require('express'),
    router = express.Router(),
    publicLoginHelper = require('./helpers/publicLoginHelper'),
    emailHelper = require('./helpers/mailVerfication')
router
    .route('/core/register')
    .get(publicLoginHelper.collegeRegForm)

router
    .route('/core/login')
    .post(publicLoginHelper.collegeLogin)

router
    .route('/core/login/up')
    .post(publicLoginHelper.registerCollege)

router
    .route('/core/login/out')
    .delete(publicLoginHelper.logout)

router
    .route('/secure/verification/:accountType/:secret')
    .get(emailHelper.emailVerifyAPI)

module.exports = router