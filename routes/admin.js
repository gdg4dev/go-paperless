const express = require('express'),
    router = express.Router(),
    adminHelper = require('./helpers/admin-helper.js')

console.log('amdin.js')
router
    .route('/')
    .get(adminHelper.dashboard)

router
    .route('/login')
    .post(adminHelper.login)

module.exports = router