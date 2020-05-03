const express = require('express'),
    router = express.Router(),
    publicLoginHelper = require('./helpers/publicLoginHelper')

router
    .route('/register')
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
    .route('/secure/verification/:secret')
    .get(publicLoginHelper.emailVerifyAPI)

module.exports = router