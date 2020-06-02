const express = require("express");
const router = express.Router();
const publicLoginHelper = require("./helpers/publicLoginHelper");
const emailHelper = require("./helpers/mailVerfication");
const uploadHandler = require("./helpers/uploadHandlers");
const auth = require("./helpers/tokens/isAuth");

router
    .route("/core/register/:type")
    .get(auth.inLoginPage, publicLoginHelper.globalRegForm);
router
    .route("/core/login/:type")
    .get(auth.inLoginPage, publicLoginHelper.globalLoginForm);
router
    .route("/core/login/in/:type")
    .post(auth.inLoginPage, publicLoginHelper.globalLogin);
router
    .route("/core/login/up/:type")
    .post(auth.inLoginPage, publicLoginHelper.globalReg);
router
    .route("/core/login/out")
    .delete(auth.inLoginPage, publicLoginHelper.logout);

// sends email verification
router
    .route("/secure/verification/:accountType/:secret")
    .get(emailHelper.emailVerifyAPI);

router.route("/upload/image").post(uploadHandler.singleImageUploadHandler);
router
    .route("/upload/document")
    .post(uploadHandler.singleDocumentUploadHandler);

module.exports = router;