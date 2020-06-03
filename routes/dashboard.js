const express = require("express");
const router = express.Router();
const dashboardHelper = require("./helpers/dashboardHelper");
const emailHelper = require("./helpers/mailVerfication");
const uploadHandler = require("./helpers/uploadHandlers");
const auth = require("./helpers/tokens/isAuth");


router
    .route("/college")
    .get(auth.parseUserCookies, auth.isCollege, dashboardHelper.loadCollegeDashboard);

router.route("/college/logout").get(auth.parseUserCookies,auth.isCollege,dashboardHelper.collegeLogout)

router
    .route("/student")
    .get(auth.parseUserCookies, auth.isStudent, dashboardHelper.loadStudentDashboard);

router
    .route("/faculty")
    .get(auth.parseUserCookies, auth.isFaculty, dashboardHelper.loadFacultyDashboard);

router
    .route("/proctor")
    .get(auth.parseUserCookies, auth.isProctor, dashboardHelper.loadProctorDashboard);

module.exports = router;