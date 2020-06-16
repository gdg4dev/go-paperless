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
    .route("/student/upcoming-exams")
    .get(auth.parseUserCookies, auth.isStudent, dashboardHelper.stuUpcoming_Exams)
router
    .route("/student/previous-exams")
    .get(auth.parseUserCookies, auth.isStudent, dashboardHelper.stuPrevExams)
router
    .route("/student/exam/:examID/start")
    .get(auth.parseUserCookies, auth.isStudent, dashboardHelper.startExam)
router
    .route("/student/exam/:examID/start")
    .get(auth.parseUserCookies, auth.isStudent, dashboardHelper.initExam)
// router
//     .route("/student/exam/:examID/start")
//     .post(auth.parseUserCookies, auth.isStudent, dashboardHelper.startExamPost)

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
    .route("/faculty/exam/:examID/edit")
    .get(auth.parseUserCookies, auth.isFaculty, auth.examExists, dashboardHelper.examEdit)
router
    .route("/faculty/previous-exams")
    .get(auth.parseUserCookies, auth.isFaculty, dashboardHelper.prevExams)

router
    .route("/proctor")
    .get(auth.parseUserCookies, auth.isProctor, dashboardHelper.loadProctorDashboard);
router
    .route("/proctor/logout")
    .get(auth.parseUserCookies, auth.isProctor, dashboardHelper.proctorLogout)
module.exports = router;