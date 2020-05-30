const express = require("express"),
  router = express.Router(),
  publicLoginHelper = require("./helpers/publicLoginHelper"),
  emailHelper = require("./helpers/mailVerfication"),
  uploadHandler = require("./helpers/uploadHandlers")
// college registration form
router.route("/core/register/:type").get(publicLoginHelper.globalRegForm);
// .get(publicLoginHelper.collegeRegForm)

// college login form
router.route("/core/login/:type").get(publicLoginHelper.globalLoginForm);
// .get(publicLoginHelper.collegeLoginForm)

// perform login
router.route("/core/login/in/:type").post(publicLoginHelper.globalLogin);
// .post(publicLoginHelper.collegeLogin)

// perform signup  fileFilter:fileFilter

router
  .route("/core/login/up/:type")
  .post(publicLoginHelper.globalReg);
// .post(publicLoginHelper.registerCollege)

// performs logout by jwt id
router.route("/core/login/out").delete(publicLoginHelper.logout);

// sends email verification
router
  .route("/secure/verification/:accountType/:secret")
  .get(emailHelper.emailVerifyAPI);


router
.route('/upload/image')
.post(uploadHandler.singleImageUploadHandler)
router
.route('/upload/document')
.post(uploadHandler.singleDocumentUploadHandler)

module.exports = router;
