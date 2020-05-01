const express = require('express'),
    router = express.Router(),
    adminHelper = require('./helpers/admin-helper.js')

router
    .route('/')
    .get(adminHelper.dashboard)

router
    .route('/login')
    .post(adminHelper.login)

router
    .route('/login/out')
    .delete(adminHelper.logout)

module.exports = router