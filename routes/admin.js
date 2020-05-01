const express = require('express'),
    router = express.Router(),
    adminHelper = require('./helpers/admin-helper.js'),
    fs = require('fs')

router
    .route('/')
    .post(adminHelper.dashboard)

router
    .route('/login')
    .post(adminHelper.login)

module.exports = router