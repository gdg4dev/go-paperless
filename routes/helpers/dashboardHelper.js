const {
    colleges,
    faculties,
    students,
    exams,
    proctors
} = require("../../db/dbs");
const {
    toPrivateData,
    decrypt,
    encrypt
} = require('./encryption/enc');
const {
    jwtr
} = require("./tokens/isAuth");


const loadCollegeDashboard = (req, res, next) => {
    removeCookieOnError = (res) => {
        res.cookie("token", 0, {
            // httpOnly: true,
            expires: new Date(Number(new Date()) + 1000)
        });
        res.status(401).redirect('/core/login/c')
    }
    try {
        college_id = req.user.id
        colleges.findById(college_id, (err, doc) => {
            if (err) return removeCookieOnError(res)
            students.find({
                "college_id": college_id
            }).countDocuments((err, doc2) => {
                if (err) return removeCookieOnError(res)
                faculties.find({
                    "college_id": college_id
                }).countDocuments((err, doc3) => {
                    if (err) return removeCookieOnError(res)
                    exams.find({
                        "college_id": college_id
                    }).countDocuments((err, doc4) => {
                        if (err) return removeCookieOnError(res)
                        try {
                            let data = {
                                collegeEmail: decrypt(doc.college_email.emailAddr),
                                collegeName: decrypt(doc.college_name),
                                avatarURL: doc.avatar,
                                notificationCount: 0,
                                totalFaculties: doc3,
                                totalStudents: doc2,
                                totalExamsTaken: doc4,
                                showCollegeDashHeader: true,
                                mainMenu: true,
                                MaStu: false,
                                viStu: false,
                                adStu: false,
                                maFac: false,
                                viFac: false,
                                adFac: false,
                                setting: false
                            }
                            return res.render('collegeDashboard', data)
                        } catch (e) {
                            console.log(e);
                            removeCookieOnError(res)
                        }
                    })
                })
            })
        })
    } catch (e) {
        console.log('1');
        console.log(e);
        removeCookieOnError(res)
    }
}

const collegeLogout = (req, res, next) => {
    try {
        colleges.findById(req.user.id, (err, doc) => {
            if (err) return res.status(400).send()
            try {
                jwtr.destroy(req.jti)
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                res.cookie("token", 0, {
                    // httpOnly: true,
                    expires: new Date(Number(new Date()) + 2)
                });
                return res.status(200).redirect('/core/login/c')
            } catch (e) {
                return res.status(400).send()
            }
        })
    } catch (e) {
        return res.status(400).send()
    }
}

const viewStudents = (req, res, next) => {
    try {
        colleges.findById(req.user.id, (err, doc) => {
            if (err) return res.status(400).send()
            res.render('view-students-college', {
                collegeName: decrypt(doc.college_name),
                avatarURL: doc.avatar,
                mainMenu: false,
                MaStu: true,
                viStu: true,
                adStu: false,
                maFac: false,
                viFac: false,
                adFac: false,
                setting: false,
                tables: true
            })
        })
    } catch (e) {
        return res.status(400).send()
    }
}

const addStudents = (req, res, next) => {
    try {
        colleges.findById(req.user.id, (err, doc) => {
            if (err) return res.status(400).send()
            res.render('add-student-college', {
                collegeName: decrypt(doc.college_name),
                avatarURL: doc.avatar,
                mainMenu: false,
                MaStu: true,
                viStu: false,
                adStu: true,
                maFac: false,
                viFac: false,
                adFac: false,
                setting: false
            })
        })
    } catch (e) {
        return res.status(400).send()
    }

}

const viewFaculties = (req, res, next) => {
    try {
        colleges.findById(req.user.id, (err, doc) => {
            if (err) return res.status(400).send()
            res.render('view-faculty-college', {
                collegeName: decrypt(doc.college_name),
                avatarURL: doc.avatar,
                mainMenu: false,
                MaStu: false,
                viStu: false,
                adStu: false,
                maFac: true,
                viFac: true,
                adFac: false,
                setting: false,
                tables: true
            })
        })
    } catch (e) {
        return res.status(400).send()
    }
}

const addFaculties = (req, res, next) => {
    try {
        colleges.findById(req.user.id, (err, doc) => {
            if (err) return res.status(400).send()
            res.render('add-faculty-college.hbs', {
                collegeName: decrypt(doc.college_name),
                avatarURL: doc.avatar,
                mainMenu: false,
                MaStu: false,
                viStu: false,
                adStu: false,
                maFac: true,
                viFac: false,
                adFac: true,
                setting: false
            })
        })
    } catch (e) {
        return res.status(400).send()
    }

}

const editCollegeProfile = (req, res, next) => {
    try {
        colleges.findById(req.user.id, (err, doc) => {
            if (err) return res.status(400).send()
            college_email = decrypt(doc.college_email.emailAddr)
            res.render('college-settings', {
                collegeName: decrypt(doc.college_name),
                avatarURL: doc.avatar,
                setting: true,
                college_email
            })
        })
    } catch (e) {
        return res.status(400).send()
    }

}



const loadStudentDashboard = (req, res, next) => {
    removeCookieOnError = (res) => {
        res.cookie("token", 0, {
            // httpOnly: true,
            expires: new Date(Number(new Date()) + 1000)
        });
        res.status(401).redirect('/core/login/s')
    }
    try {
        student_id = req.user.id
        students.findById(student_id, (err, doc) => {
            if (err) return removeCookieOnError(res)
            if (!doc) return removeCookieOnError(res)
            res.render('studentDash', {
                studentEmail: decrypt(doc.student_email.emailAddr),
                collegeName: decrypt(doc.student_name),
                avatarURL: doc.avatar,
                notificationCount: 0,
                mainMenu: true
            })
        })
    } catch (e) {
        console.log(e);
        removeCookieOnError(res)
    }
}

const stuUpcomingExams = (req, res, next) => {
    removeCookieOnError = (res) => {
        res.cookie("token", 0, {
            // httpOnly: true,
            expires: new Date(Number(new Date()) + 1000)
        });
        res.status(401).redirect('/core/login/s')
    }
    try {
        student_id = req.user.id
        students.findById(student_id, (err, doc) => {
            if (err) return removeCookieOnError(res)
            if (!doc) return removeCookieOnError(res)
            res.render('studentDash', {
                studentEmail: decrypt(doc.student_email.emailAddr),
                collegeName: decrypt(doc.student_name),
                avatarURL: doc.avatar,
                notificationCount: 0,
                maExa: true,
                upExa: true
            })
        })
    } catch (e) {
        console.log(e);
        removeCookieOnError(res)
    }
}

const stuPrevExams = (req, res, next) => {

}

const startExam = (req, res, next) => {

}

const startExamPost = (req, res, next) => {

}
const studentLogout = (req, res, next) => {
    try {
        students.findById(req.user.id, (err, doc) => {
            if (err) return res.status(400).send()
            try {
                jwtr.destroy(req.jti)
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                res.cookie("token", 0, {
                    // httpOnly: true,
                    expires: new Date(Number(new Date()) + 2)
                });
                return res.status(200).redirect('/core/login/s')
            } catch (e) {
                return res.status(400).send()
            }
        })
    } catch (e) {
        return res.status(400).send()
    }
}

const stuUpcoming_Exams = (req, res, next) => {
    try {
        students.findById(req.user.id)
            .then(student => {
                if (!student) return res.status(400).send()
                college_email = decrypt(student.student_email.emailAddr)
                console.log(college_email);
                return res.render('studentUpcomingExam', {
                    collegeName: decrypt(student.student_name),
                    avatarURL: student.avatar,
                    college_email,
                    tables: true,
                    maExa: true,
                    upExa: true
                })
            })
            .catch(error => {
                console.log(__line);
                console.log(error);
                return res.status(400).send()
            })
    } catch (e) {
        console.log(__line);
        return res.status(400).send()
    }
}


const loadFacultyDashboard = (req, res, next) => {
    removeCookieOnError = (res) => {
        res.cookie("token", 0, {
            // httpOnly: true,
            expires: new Date(Number(new Date()) + 1000)
        });
        res.status(401).redirect('/core/login/f')
    }
    try {
        faculty_id = req.user.id
        faculties.findById(faculty_id, (err, doc) => {
            if (err) return removeCookieOnError(res)
            if (!doc) return removeCookieOnError(res)
            res.render('facultyDash', {
                studentEmail: decrypt(doc.faculty_email.emailAddr),
                collegeName: decrypt(doc.faculty_name),
                avatarURL: doc.avatar,
                notificationCount: 0,
                mainMenu: true
            })
        })
    } catch (e) {
        console.log(e);
        removeCookieOnError(res)
    }
}

const editFacultyProfile = (req, res, next) => {
    try {
        faculties.findById(req.user.id, (err, doc) => {
            if (err) return res.status(400).send()
            college_email = decrypt(doc.faculty_email.emailAddr)
            res.render('faculty-settings', {
                collegeName: decrypt(doc.faculty_name),
                avatarURL: doc.avatar,
                setting: true,
                college_email
            })
        })
    } catch (e) {
        return res.status(400).send()
    }
}
const facultyLogout = (req, res, next) => {
    try {
        colleges.findById(req.user.id, (err, doc) => {
            if (err) return res.status(400).send()
            try {
                jwtr.destroy(req.jti)
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                res.cookie("token", 0, {
                    // httpOnly: true,
                    expires: new Date(Number(new Date()) + 2)
                });
                return res.status(200).redirect('/core/login/f')
            } catch (e) {
                return res.status(400).send()
            }
        })
    } catch (e) {
        return res.status(400).send()
    }
}

const newExamFac = (req, res, next) => {
    try {
        faculties.findById(req.user.id).then(faculty => {
            if (!faculty) return res.status(400).send()

            res.render('new-exam', {
                collegeName: decrypt(faculty.faculty_name),
                avatarURL: faculty.avatar,
                maExa: true,
                newExa: true
            })
        }).catch(e => {
            console.log(e);
            return res.status(400).send()
        })
    } catch (e) {
        console.log(e);
        return res.status(400).send()
    }
}

const examEdit = (req, res, next) => {
    collegeName = req.user.collegeName
    avatarURL = req.user.avatarURL
    if (req.exam.type === 'mcq') {
        res.render('addMCQ', {
            collegeName,
            avatarURL
        })
    } else if (req.exam.type === 'qa' || req.exam.type === 'rq') {
        res.render('addQA', {
            collegeName,
            avatarURL
        })
    } else {
        console.log(__line);
        return res.status(400).send()
    }
}

const prevExams = (req, res, next) => {
    try {
        faculties.findById(req.user.id).then(faculty => {
            if (!faculty) return res.status(400).send()

            res.render('prev-exams', {
                collegeName: decrypt(faculty.faculty_name),
                avatarURL: faculty.avatar,
                maExa: true,
                preExa: true,
                tables: true
            })
        }).catch(e => {
            console.log(e);
            return res.status(400).send()
        })
    } catch (e) {
        console.log(e);
        return res.status(400).send()
    }
}

const loadProctorDashboard = (req, res, next) => {
    removeCookieOnError = (res) => {
        res.cookie("token", 0, {
            expires: new Date(Number(new Date()) + 1000)
        });
        res.status(401).redirect('/core/login/p')
    }
    try {
        proctor_id = req.user.id
        proctors.findById(proctor_id, (err, doc) => {
            if (err) return removeCookieOnError(res)
            if (!doc) return removeCookieOnError(res)

        })
    } catch (e) {
        console.log(e);
        removeCookieOnError(res)
    }
}

const proctorLogout = (req, res, next) => {
    try {
        colleges.findById(req.user.id, (err, doc) => {
            if (err) return res.status(400).send()
            try {
                jwtr.destroy(req.jti)
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                res.cookie("token", 0, {
                    // httpOnly: true,
                    expires: new Date(Number(new Date()) + 2)
                });
                return res.status(200).redirect('/core/login/p')
            } catch (e) {
                return res.status(400).send()
            }
        })
    } catch (e) {
        return res.status(400).send()
    }
}
module.exports = {
    loadCollegeDashboard,
    loadStudentDashboard,
    loadFacultyDashboard,
    loadProctorDashboard,
    collegeLogout,
    studentLogout,
    facultyLogout,
    proctorLogout,
    viewStudents,
    addStudents,
    viewFaculties,
    addFaculties,
    editCollegeProfile,
    editFacultyProfile,
    newExamFac,
    examEdit,
    prevExams,
    stuUpcomingExams,
    stuPrevExams,
    startExam,
    startExamPost,
    stuUpcoming_Exams
}


// check if logged in
// check if same type 
// check if user exists
// dashboard!!!!