const express = require("express"),
  router = express.Router(),
  publicLoginHelper = require("./helpers/publicLoginHelper"),
  emailHelper = require("./helpers/mailVerfication"),
  path= require('path')
  multer = require("multer");
// random string generator 
function generateRandomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, `../public/uploads/temp/`));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      encodeURIComponent(
        `${file.fieldname}-${Date.now()}-${generateRandomString(25)}${path.extname(file.originalname)}`
      )
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    (file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/msword" ||
    file.mimetype === "application/pdf")
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
uploadFile = multer({
    storage:storage,
  limits: {
    fileSize: 1024 * 1024 * 2, //2mb
  },
  fileFilter:fileFilter
});
// college registration form
router.route("/core/register/:type").get(publicLoginHelper.globalRegForm);
// .get(publicLoginHelper.collegeRegForm)

// college login form
router.route("/core/login/:type").get(publicLoginHelper.globalLoginForm);
// .get(publicLoginHelper.collegeLoginForm)

// perform login
router.route("/core/login/in/:type").post(publicLoginHelper.globalLogin);
// .post(publicLoginHelper.collegeLogin)

// perform signup
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


router.route('/upload/image').post(uploadFile.single("image"),(req,res)=>res.json({status: 'done'}))
router.route('/upload/document').post(uploadFile.single("document"),(req,res)=>res.json({status: 'done'}))

module.exports = router;
