const {
    colleges
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
        colleges.findById(req.user.id, (err, doc) => {
            if (err) return removeCookieOnError(res)
            try {
                let data = {
                    collegeEmail: decrypt(doc.college_email.emailAddr),
                    collegeName: decrypt(doc.college_name),
                    avatarURL: doc.avatar
                }

                console.log(doc.avatar);
                res.render('collegeDashboard', data)
            } catch (e) {
                removeCookieOnError(res)
            }
        })
    } catch (e) {
        removeCookieOnError(res)
    }
}

const collegeLogout = (req, res, next) => {
    try {
        colleges.findById(req.user.id, (err, doc) => {
            if (err) return res.status(400).send()
            try{
                jwtr.destroy(req.jti)
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