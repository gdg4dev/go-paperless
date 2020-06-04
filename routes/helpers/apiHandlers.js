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

const msg = {
    unauthorisedMsg: (res) => {
        return res.status(403).send({
            error: 1,
            code: 2203,
            message: "You Are Not Authorised To Access This Route"
        })
    },
    invalidPayloadMsg: (res) => {
        return res.send({
            error: 1,
            code: 2204,
            message: "Invalid Payload"
        })
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
    // 10270 - add new faculty from college  {fac_id & col_id}
    // 10280 - remove faculty

    // 300-309 faculty-settings; 310-330 Student Action; 331-399 Exam+proctor Actions;
    // 10310 - list students under same college { enrollment }
    // 10331 - create exam {examIDSchema = cid_fac-id_sub_date }
    // 10332 - proctor change

    if (req.body.payload && req.body) {
        try {
            decryptedPayload = rsaDecrypt(req.body.payload.toString())
            if (!(decryptedPayload.actionCode && decryptedPayload.token && decryptedPayload.opt)) return msg.invalidPayloadMsg(res)
            if (!(req.token === decryptedPayload.token)) return msg.invalidPayloadMsg(res)
            action = decryptedPayload.action
            opt = decryptedPayload.opt

            // if()



        } catch (e) {
            return msg.invalidPayloadMsg(res)
        }
    } else {
        return msg.unauthorisedMsg(res)
    }
}

module.exports = {
    globalApiHandlers
}