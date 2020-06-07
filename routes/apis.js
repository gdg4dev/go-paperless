const express = require("express");
const router = express.Router();
const dashboardHelper = require("./helpers/dashboardHelper");
const emailHelper = require("./helpers/mailVerfication");
const uploadHandler = require("./helpers/uploadHandlers");
const auth = require("./helpers/tokens/isAuth");
const apiHandlers = require('./helpers/apiHandlers')

router.route("/v1").post(auth.performAPIAuth, apiHandlers.globalApiHandlers)

module.exports = router