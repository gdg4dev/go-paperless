const {
    colleges,
    faculties,
    students,
    exams
} = require("../../db/dbs");
const {
    toPrivateData,
    toPublicData,
    decrypt,
    encrypt,
    encryptAPIResponse
} = require('./encryption/enc');
const fs = require('fs')
errLog = fs.createWriteStream('../../private/errLogs')
const msg = {
    unauthorisedMsg: (res) => {
        return res.status(403).send(encryptAPIResponse({
            error: 1,
            code: 2203,
            message: "You Are Not Authorised To Access This Route",
            data: {}
        }))
    },
    invalidPayloadMsg: (res) => {
        return res.send(encryptAPIResponse({
            error: 1,
            code: 2204,
            message: "Invalid Payload",
            data: {}
        }))
    },
    successResponseMsg: (res, data) => {
        resData = {
            error: 0,
            message: "OK!",
            data
        }
        return res.status(200).send(encryptAPIResponse(resData))
    }
}

const globalApiHandlers = (req, res, next) => {
    // 10 = API Actions 
    // 200 = college actions 
    // 300 = faculty actions
    // 400 = proctor actions 
    // 500 = student actions
    // 600-800 = exam actions ?? 

    // 200-209 colllge-settings; 210-249 college-student; 250-299 college-fac
    // 10210 - list students from colleges
    // 10220 - remove student from college {enrolLID/student_id & college id}
    // 10230 - add new student from college {enrollment-no, email}
    // 10250 - list faculties from college  
    // 10260 - remove faculty from college {fac_id & col_id}
    // 10270 - add new faculty from college  {fac_id & col_id}s

    // 300-309 faculty-settings; 310-330 Student Action; 331-399 Exam+proctor Actions;
    // 10310 - list students under same college { enrollment }
    // 10331 - create exam {examIDSchema = cid_fac-id_sub_date }
    // 10332 - proctor change

    if (req.body.payload && req.body) {
        try {
            decryptedPayload = rsaDecrypt(req.body.payload.toString())
            if (!(decryptedPayload.actionCode && decryptedPayload.token && decryptedPayload.opt)) return msg.invalidPayloadMsg(res)
            if (!(req.token === decryptedPayload.token)) return msg.invalidPayloadMsg(res)
            action = decryptedPayload.actionCode
            opt = decryptedPayload.opt
            switch (action) {
                case 10201:
                    getCollegeProfileInfo(req,res)
                    break
                case 10202:
                    editCollegeProfileInfo(req,res)
                    break
                case 10210:
                    getListOfSuudentsFromCollege(req, res)
                    break
                case 10220:
                    removeStudentFromCollege(req, res, opt)
                    break
                case 10230:
                    addNewStudentToCollege(req, res, opt)
                    break
                case 10250:
                    listFacultiesFromCollege(req, res)
                    break
                case 10260:
                    removeFacultyFromCollege(req, res, opt)
                    break
                case 10270:
                    addNewFacultyToCollege(req,res,opt)
                    break
                default:
                    msg.invalidPayloadMsg(res)
                    break
            }
        } catch (e) {
            return msg.invalidPayloadMsg(res)
        }
    } else {
        return msg.unauthorisedMsg(res)
    }
}

const getListOfSuudentsFromCollege = (req, res) => {
    students.find({
            "college_id": req.user.id
        }).limit(25)
        .then(StudentList => {
            if (!StudentList[0]) return res.send('No student Found')
            studentData = StudentList.map(v, i => {
                id = v._id
                name = decrypt(v.student_name)
                email = decrypt(v.student_email)
                avatar = v.student_avatar
                return {
                    id,
                    name,
                    email,
                    avatar
                }
            })
            return msg.successResponseMsg(res, data)
        })
        .catch(async e => {
            await errLog.write({
                Error: e,
                time: Date.now()
            }, 'UTF8')
            return encryptAPIResponse(msg.invalidPayloadMsg(res))
        })
}

module.exports = {
    globalApiHandlers
}