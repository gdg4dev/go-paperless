const express = require("express");
const router = express.Router();
const dashboardHelper = require("./helpers/dashboardHelper");
const emailHelper = require("./helpers/mailVerfication");
const uploadHandler = require("./helpers/uploadHandlers");
const auth = require("./helpers/tokens/isAuth");


router
    .route("/college")
    .get(auth.parseUserCookies, auth.isCollege, dashboardHelper.loadCollegeDashboard);
router
    .route("/college/logout")
    .get(auth.parseUserCookies, auth.isCollege, dashboardHelper.collegeLogout)
router
    .route("/college/view-students")
    .get(auth.parseUserCookies, auth.isCollege, dashboardHelper.viewStudents)
router
    .route("/college/new-student")
    .get(auth.parseUserCookies, auth.isCollege, dashboardHelper.addStudents)
router
    .route("/college/view-faculties")
    .get(auth.parseUserCookies, auth.isCollege, dashboardHelper.viewFaculties)
router
    .route("/college/new-faculty")
    .get(auth.parseUserCookies, auth.isCollege, dashboardHelper.addFaculties)
router
    .route("/college/settings")
    .get(auth.parseUserCookies, auth.isCollege, dashboardHelper.editCollegeProfile)

router
    .route("/student")
    .get(auth.parseUserCookies, auth.isStudent, dashboardHelper.loadStudentDashboard);
router
    .route("/student/logout")
    .get(auth.parseUserCookies, auth.isStudent, dashboardHelper.studentLogout)

router
    .route("/faculty")
    .get(auth.parseUserCookies, auth.isFaculty, dashboardHelper.loadFacultyDashboard);
router
    .route("/faculty/logout")
    .get(auth.parseUserCookies, auth.isFaculty, dashboardHelper.facultyLogout)
router
    .route("/faculty/settings")
    .get(auth.parseUserCookies, auth.isFaculty, dashboardHelper.editFacultyProfile)
router
.route("/faculty/new-exam")
.get(auth.parseUserCookies, auth.isFaculty, dashboardHelper.newExamFac)

router
    .route("/proctor")
    .get(auth.parseUserCookies, auth.isProctor, dashboardHelper.loadProctorDashboard);
router
    .route("/proctor/logout")
    .get(auth.parseUserCookies, auth.isProctor, dashboardHelper.proctorLogout)
module.exports = router;