const {
    colleges,
    faculties,
    students,
    exams
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
            httpOnly: true,
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
                    exams.find({"college_id":college_id}).countDocuments((err,doc4)=>{
                        if (err) return removeCookieOnError(res)
                        try {
                            let data = {
                                collegeEmail: decrypt(doc.college_email.emailAddr),
                                collegeName: decrypt(doc.college_name),
                                avatarURL: doc.avatar,
                                notificationCount: 0,
                                totalFaculties: doc3,
                                totalStudents: doc2,
                                totalExamsTaken: doc4
                            }
                            console.log(doc.avatar);
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
                    httpOnly: true,
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

const loadStudentDashboard = () => {

}
const loadFacultyDashboard = () => {

}
const loadProctorDashboard = () => {

}
module.exports = {
    loadCollegeDashboard,
    loadStudentDashboard,
    loadFacultyDashboard,
    loadProctorDashboard,
    collegeLogout
}


// check if logged in
// check if same type 
// check if user exists
// dashboard!!!!