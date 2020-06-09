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
    decryptAPIPayload,
    encryptAPIResponse
} = require('./encryption/enc');
const randomCrypto = require("crypto-random-string");
const fs = require('fs')

function convertDate(inputFormat) {
    function pad(s) {
        return (s < 10) ? '0' + s : s;
    }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
}

// errLog = fs.createWriteStream('errlogs')
function generatePassword(length = 8) {
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}
Object.defineProperty(global, '__stack', {
    get: function () {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

Object.defineProperty(global, '__line', {
    get: function () {
        return __stack[1].getLineNumber();
    }
});

Object.defineProperty(global, '__function', {
    get: function () {
        return __stack[1].getFunctionName();
    }
});
const msg = {
    unauthorisedMsg: (res) => {

        // console.log(__line);
        console.log(__function);
        return res.status(403).send(encryptAPIResponse(JSON.stringify({
            error: 1,
            code: 2203,
            message: "You Are Not Authorised To Access This Route",
            data: {}
        })))
    },
    invalidPayloadMsg: (res) => {
        return res.send(encryptAPIResponse(JSON.stringify({
            error: 1,
            code: 2204,
            message: "Invalid Payload",
            data: {}
        })))
    },
    successResponseMsg: (res, data) => {
        resData = {
            error: 0,
            message: "OK!",
            data
        }
        return res.status(200).send(encryptAPIResponse(JSON.stringify(resData)))
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
    // 10302 - faculty setting

    // 10650 - create Exam
    // 10660 - add questions
    // 10670 - get list of exams by faculty
    // 10750 - submit Answer


    // 300-309 faculty-settings; 310-330 Student Action; 331-399 Exam+proctor Actions;
    // 10310 - list students under same college { enrollment }
    // 10331 - create exam {examIDSchema = cid_fac-id_sub_date }
    // 10332 - proctor change

    if (req.body.payload && req.body) {
        try {
            decryptedPayload = JSON.parse(decryptAPIPayload(req.body.payload.toString()))
            console.log(decryptAPIPayload);
            if (!(decryptedPayload.actionCode && decryptedPayload.token && decryptedPayload.opt)) return msg.invalidPayloadMsg(res)
            if (!(req.token === decryptedPayload.token)) {
                console.log(__line);
                return msg.invalidPayloadMsg(res);
            }

            action = decryptedPayload.actionCode
            opt = decryptedPayload.opt

            switch (action) {
                case 10201:
                    console.log(__line);
                    getCollegeProfileInfo(req, res, opt) //done
                    break
                case 10202:
                    console.log(__line);
                    editCollegeProfileInfo(req, res, opt) // done
                    break
                case 10210:
                    console.log(__line);
                    getListOfStudentsFromCollege(req, res) //done
                    break
                case 10220:
                    console.log(__line);
                    removeStudentFromCollege(req, res, opt) // done
                    break
                case 10230:
                    console.log(__line);
                    addNewStudentToCollege(req, res, opt) // done
                    break
                case 10250:
                    console.log(__line);
                    listFacultiesFromCollege(req, res) // done
                    break
                case 10260:
                    console.log(__line);
                    removeFacultyFromCollege(req, res, opt) // done 
                    break
                case 10270:
                    console.log(__line);
                    addNewFacultyToCollege(req, res, opt) // done
                    break
                case 10302:
                    console.log(__line);
                    editFacultyProfileInfo(req, res, opt) // done
                    break
                case 10650:
                    console.log(__line);
                    createANewExam(req, res, opt) // done
                    break
                case 10660:
                    console.log(__line);
                    addANewQuestion(req, res, opt)
                    break
                case 10670:
                    console.log(__line);
                    getListOfExamsByFaculty(req,res,opt)
                case 10750:
                    console.log(__line);
                    processSubmittedAnswer(req, res, opt)
                    break
                default:
                    console.log(__line);
                    msg.invalidPayloadMsg(res)
                    break
            }
        } catch (e) {
            console.log(e);
            return msg.invalidPayloadMsg(res)
        }
    } else {
        console.log(e);
        return msg.unauthorisedMsg(res)
    }
}

const getListOfStudentsFromCollege = (req, res) => {
    try {
        students.find({
                "college_id": req.user.id,
                "banned": false
            }).limit(25)
            .then(StudentList => {
                if (!StudentList[0]) return msg.successResponseMsg(res, {
                    response: "No student Found",
                    code: 10000
                })
                studentData = StudentList.map((v) => {
                    id = v.student_id
                    name = decrypt(v.student_name)
                    email = decrypt(v.student_email.emailAddr)
                    since = convertDate(v.registredOn.toString())
                    return {
                        id,
                        name,
                        email,
                        since
                    }
                })
                console.log(studentData);
                return msg.successResponseMsg(res, studentData)
            })
            .catch(async e => {
                console.log(e);
                return msg.invalidPayloadMsg(res)
            })
    } catch (e) {
        return msg.invalidPayloadMsg(res)
    }
}

const removeStudentFromCollege = (req, res, opt) => {
    if (!(opt || opt.studentsToRemove)) return msg.invalidPayloadMsg(res)
    try {
        opt.studentsToRemove.forEach((v, i, a) => {
            students.findOneAndUpdate({
                "college_id": req.user.id,
                "student_id": v
            }, {
                "banned": true,
                "bannedBy": 'College'
            }).catch(e => {
                return msg.invalidPayloadMsg(res)
            })

            i === a.length - 1 ? msg.successResponseMsg(res, {
                response: "Successfully Banned Students",
                code: 10000
            }) : ''
        })
    } catch (e) {
        return msg.invalidPayloadMsg(res)
    }
}

const addNewStudentToCollege = (req, res, opt) => {
    if (!(opt || opt.studentsToAdd)) return msg.invalidPayloadMsg(res)
    try {
        isAllStudentsInfoAvailable = true
        colleges.findById(req.user.id).then(foundCollege => {
            if (!foundCollege) return msg.unauthorisedMsg(res)
            try {
                opt.studentsToAdd.forEach((v) => {
                    console.log(v);
                    if (!(v.student_name && v.student_email && v.student_id)) return isAllStudentsInfoAvailable = false
                    v.college_id = req.user.id,
                        generatedPassword = generatePassword(15)
                    console.log(generatedPassword);
                    v.student_password = encrypt(generatedPassword.toString())
                    v.student_name = encrypt(v.student_name)
                    studentEmail = encrypt(v.student_email)
                    secret1 = randomCrypto({
                        length: 17,
                        type: "url-safe",
                    });
                    secret2 = encrypt(
                        encrypt(v.student_name, `${process.env.GP_PRIVATE_ENC_DEC_KEY}`),
                        `${process.env.GP_PUB_ENC_DEC_KEY}`
                    );
                    v.student_email = {
                        emailAddr: studentEmail,
                        verified: false,
                        sent: false,
                        secret: encodeURIComponent(`${secret1}..${secret2}`)
                    }
                })
                if (!(isAllStudentsInfoAvailable)) {
                    console.log({
                        a: 'here'
                    });
                    return msg.invalidPayloadMsg(res)
                }
                students.insertMany(opt.studentsToAdd)
                    .then(d => {
                        console.log(d);
                        return msg.successResponseMsg(res, {
                            data: "Successfully Added Students"
                        })
                    })
                    .catch(e => {
                        console.log(e);
                        return msg.invalidPayloadMsg(res)
                    })
            } catch (e) {
                console.log(e);
                return msg.invalidPayloadMsg(res)
            }
        }).catch(e => {
            console.log(e);
            return msg.invalidPayloadMsg(res)
        })
    } catch (e) {
        console.log(e);
        return msg.invalidPayloadMsg(res)
    }
}

const listFacultiesFromCollege = (req, res) => {
    // console.log('callllllllllld');
    try {
        faculties.find({
                "college_id": req.user.id,
                "banned": false
            }).limit(25)
            .then(FacultyList => {
                if (!FacultyList[0]) return msg.successResponseMsg(res, {
                    response: "No Faculties Found",
                    code: 10000
                })
                facultyData = FacultyList.map((v) => {
                    id = v.faculty_id
                    name = decrypt(v.faculty_name)
                    email = decrypt(v.faculty_email.emailAddr)
                    since = convertDate(v.registredOn.toString())
                    return {
                        id,
                        name,
                        email,
                        since
                    }
                })
                console.log(facultyData);
                return msg.successResponseMsg(res, facultyData)
            })
            .catch(async e => {
                console.log(e);
                return msg.invalidPayloadMsg(res)
            })
    } catch (e) {
        console.log(e);
        return msg.invalidPayloadMsg(res)
    }
}

const removeFacultyFromCollege = (req, res, opt) => {
    console.log('aaaaaaaaaaaaaaaaaaaa');
    if (!(opt || opt.facultiesToRemove)) return msg.invalidPayloadMsg(res)
    try {
        opt.facultiesToRemove.forEach((v, i, a) => {
            faculties.findOneAndUpdate({
                "college_id": req.user.id,
                "faculty_id": v.id
            }, {
                "banned": true,
                "bannedBy": 'College'
            }).catch(e => {
                console.log(e);
                return msg.invalidPayloadMsg(res)
            })
            i === a.length - 1 ? msg.successResponseMsg(res, {
                response: "Successfully Banned Faculties"
            }) : ''
        })
    } catch (e) {
        console.log(e);
        return msg.invalidPayloadMsg(res)
    }
}

const addNewFacultyToCollege = (req, res, opt) => {
    if (!(opt || opt.facultiesToAdd)) return msg.invalidPayloadMsg(res)
    try {
        isAllFacultyInfoAvailable = true
        colleges.findById(req.user.id).then(foundCollege => {
            if (!foundCollege) return msg.unauthorisedMsg(res)
            try {
                opt.facultiesToAdd.forEach((v) => {
                    if (!(v.faculty_name && v.faculty_email && v.faculty_id)) return isAllFacultyInfoAvailable = false
                    v.college_id = req.user.id,
                        generatedPassword = generatePassword(15)
                    console.log(generatedPassword);
                    v.faculty_password = encrypt(generatedPassword.toString())
                    v.faculty_name = encrypt(v.faculty_name)
                    facultyEmail = encrypt(v.faculty_email)
                    secret1 = randomCrypto({
                        length: 17,
                        type: "url-safe",
                    });
                    secret2 = encrypt(
                        encrypt(v.faculty_name, `${process.env.GP_PRIVATE_ENC_DEC_KEY}`),
                        `${process.env.GP_PUB_ENC_DEC_KEY}`
                    );
                    v.faculty_email = {
                        emailAddr: facultyEmail,
                        verified: false,
                        sent: false,
                        secret: encodeURIComponent(`${secret1}..${secret2}`)
                    }
                })
                if (!(isAllFacultyInfoAvailable)) {
                    return msg.invalidPayloadMsg(res)
                }
                faculties.insertMany(opt.facultiesToAdd)
                    .then(d => {
                        console.log(d);
                        return msg.successResponseMsg(res, {
                            data: "Successfully Added Faculties"
                        })
                    })
                    .catch(e => {
                        console.log(e);
                        return msg.invalidPayloadMsg(res)
                    })
            } catch (e) {
                console.log(e);
                return msg.invalidPayloadMsg(res)
            }
        }).catch(e => {
            console.log(e);
            return msg.invalidPayloadMsg(res)
        })
    } catch (e) {
        console.log(e);
        return msg.invalidPayloadMsg(res)
    }
}

const getCollegeProfileInfo = (req, res, opt) => {
    try {
        colleges.findById(req.user.id).then(collegeInfo => {
            if (!collegeInfo) return msg.invalidPayloadMsg(res)
            collegeData = {
                name: decrypt(collegeInfo.college_name),
                email: decrypt(collegeInfo.college_email),
                avatar: collegeInfo.avatar || null,
                phone: collegeInfo.college_phone || null
            }
            return msg.successResponseMsg(res, collegeData)
        }).catch(err => {
            return msg.invalidPayloadMsg(res)
        })
    } catch (e) {
        return msg.invalidPayloadMsg(res)
    }
}

const editCollegeProfileInfo = (req, res, opt) => {
    if (!(opt && opt.collegeDataToUpdate)) return msg.invalidPayloadMsg(res)
    try {
        colleges.findById(req.user.id).count().then(collegeData => {
                // if college does not exists
                if (!collegeData) return msg.invalidPayloadMsg(res)
                // if it does
                college_name = encrypt(opt.collegeDataToUpdate.name)
                // avatar = opt.collegeDataToUpdate.avatar
                colleges.findOneAndUpdate({
                    "_id": req.user.id
                }, {
                    college_name
                }).then(updatedData => {
                    msg.successResponseMsg(res, {
                        response: "Data Successfully Updated"
                    })
                }).catch(err => {
                    return msg.invalidPayloadMsg(res)
                })
            })
            .catch(e => {
                return msg.invalidPayloadMsg(res)
            })
    } catch (e) {
        return msg.invalidPayloadMsg(res)
    }
}

// faculty 
const editFacultyProfileInfo = (req, res, opt) => {
    console.log(opt);
    if (!(opt && opt.facultyDataToUpdate)) return msg.invalidPayloadMsg(res)
    try {

        console.log(__line);
        faculties.findById(req.user.id).count().then(collegeData => {
                // if college does not exists
                if (!collegeData) return msg.invalidPayloadMsg(res)
                // if it does
                faculty_name = encrypt(opt.facultyDataToUpdate.name)
                // avatar = opt.collegeDataToUpdate.avatar
                faculties.findOneAndUpdate({
                    "_id": req.user.id
                }, {
                    faculty_name
                }).then(updatedData => {
                    msg.successResponseMsg(res, {
                        response: "Data Successfully Updated"
                    })
                }).catch(err => {
                    console.log(err);
                    return msg.invalidPayloadMsg(res)
                })
            })
            .catch(e => {
                console.log(e);
                return msg.invalidPayloadMsg(res)
            })
    } catch (e) {
        console.log(e);
        return msg.invalidPayloadMsg(res)
    }
}


const createANewExam = (req, res, opt) => {
    try {
        if (opt.examConfig && opt) {
            faculties.findById(req.user.id).then(async faculty => {
                let id = generatePassword(12) + parseInt(Date.now())
                let exaDateTMP = new Date(opt.examConfig.exam_dates).toISOString()
                let exaDate = new Date(exaDateTMP).toLocaleString()
                if (opt.examConfig.exam_type == "Objective (MCQ)") {
                    type = 'mcq'
                } else if (opt.examConfig.exam_type == "Subjective (QA)") {
                    type = 'rq'
                }
                exams.create({
                    exam_id: id,
                    college_id: faculty.college_id,
                    faculty_id: req.user.id,
                    date: exaDate,
                    name: opt.examConfig.exam_name,
                    participants: opt.examConfig.exam_participants,
                    duration: opt.examConfig.exam_duration * 60 * 1000, // minute to miliseconds
                    type,
                    instructions: opt.examConfig.exam_instructions
                })
                exams.save
                msg.successResponseMsg(res, {
                    res: `var a = ()=>{
                            alert('Success!')
                            window.location.href = '/dashboard/faculty/exam/${id}/edit'
                        }`
                })
            }).catch(err => {
                console.log(__line);
                console.log(err);
                return msg.unauthorisedMsg(res)
            })

        } else {
            console.log(__line);
            return msg.unauthorisedMsg(res)
        }
    } catch (e) {
        console.log(e);
        console.log(__line);
        return msg.unauthorisedMsg(res)
    }
}

const getListOfExamsByFaculty  = (req,res,opt) => {
    try {
        exams.find({faculty_id: req.user.id})
        .then(exams => {
            console.log(exams);
            if(!exams[0])  return msg.successResponseMsg(res, {
                response: "You Have Not Created Any Exams",
                code: 10000
            })

            dataToSend = exams.map((v,i)=>{
                return {
                    exam_id: v.exam_id,
                    exam_name: v.name,
                    exam_duration: v.duration / (60 * 1000),// miliseconds to minute
                    exam_date: v.date.toString().split(', ')[0],
                    exam_time: v.date.toString().split(', ')[1],
                    exam_type: v.type,
                    exam_participants: v.participants.toString() ,
                    exam_instructions: v.instructions,
                    exam_question: v.questions || 0,
                    exam_created_date: convertDate(v.createdOn.toString())
                }
            })

            return msg.successResponseMsg(res, dataToSend)
        })
        .catch(err => {
            console.log(__line);
            return msg.invalidPayloadMsg(res)
        })
    } catch {
        console.log(__line);
        return msg.invalidPayloadMsg(res)
    }
}
const addANewQuestion = (req, res, opt) => {
    try {
        if( opt && opt.question ){
            ques = opt.questiom
            
        } else {
            console.log(__line);
            return msg.unauthorisedMsg(res)
        }
    } catch (e) {
        console.log(__line);
        return msg.unauthorisedMsg(res)
    }
}
const processSubmittedAnswer = (req, res, opt) => {
    try {

    } catch (e) {
        console.log(__line);
        return msg.unauthorisedMsg(res)
    }
}

module.exports = {
    globalApiHandlers
}