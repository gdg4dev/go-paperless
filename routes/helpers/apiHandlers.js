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
const fs = require('fs')
errLog = fs.createWriteStream('errlogs')
Object.defineProperty(global, '__stack', {
    get: function() {
            var orig = Error.prepareStackTrace;
            Error.prepareStackTrace = function(_, stack) {
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
    get: function() {
            return __stack[1].getLineNumber();
        }
    });
    
    Object.defineProperty(global, '__function', {
    get: function() {
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

    // 300-309 faculty-settings; 310-330 Student Action; 331-399 Exam+proctor Actions;
    // 10310 - list students under same college { enrollment }
    // 10331 - create exam {examIDSchema = cid_fac-id_sub_date }
    // 10332 - proctor change

    if (req.body.payload && req.body) {
        try {
            decryptedPayload = decryptAPIPayload(req.body.payload.toString())
            if (!(decryptedPayload.actionCode && decryptedPayload.token && decryptedPayload.opt)) return msg.invalidPayloadMsg(res)
            if (!(req.token === decryptedPayload.token)) {console.log(__line); return msg.invalidPayloadMsg(res);}
            action = decryptedPayload.actionCode
            opt = decryptedPayload.opt
            switch (action) {
                case 10201:
                    getCollegeProfileInfo(req, res, opt) //done
                    break
                case 10202:
                    editCollegeProfileInfo(req, res, opt) // done
                    break
                case 10210:
                    getListOfStudentsFromCollege(req, res) //done
                    break
                case 10220:
                    removeStudentFromCollege(req, res, opt) // done
                    break
                case 10230:
                    addNewStudentToCollege(req, res, opt) // done
                    break
                case 10250:
                    listFacultiesFromCollege(req, res) // done
                    break
                case 10260:
                    removeFacultyFromCollege(req, res, opt) // done 
                    break
                case 10270:
                    addNewFacultyToCollege(req, res, opt) // done
                    break
                default:
                    msg.invalidPayloadMsg(res)
                    break
            }
        } catch (e) {
            console.log(e);
            return msg.invalidPayloadMsg(res)
        }
    } else {
        console.log('yo boi');
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
                return msg.invalidPayloadMsg(res)
            })
    } catch (e) {
        return msg.invalidPayloadMsg(res)
    }
}

const removeStudentFromCollege = (req, res, opt) => {
    if (!(opt || opt.studentsToRemove)) return msg.invalidPayloadMsg(res)
    try {
        opt.studentsToRemove.forEach(v, i, a => {
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
                response: "Successfully Banned Students"
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
                opt.studentsToAdd.forEach(v, i => {
                    if (!(v.studentName && v.studentEmail && v.studentEnrollmentID)) return isAllStudentsInfoAvailable = false
                })
                if (!(isAllStudentsInfoAvailable)) return msg.invalidPayloadMsg(res)
                students.insertMany(opt.studentsToAdd)
                    .then(d => {
                        console.log(d);
                        return msg.successResponseMsg(res, {
                            response: "Successfully Added Students"
                        })
                    })
                    .catch(e => {
                        return msg.invalidPayloadMsg(res)
                    })
            } catch (e) {
                return msg.invalidPayloadMsg(res)
            }
        }).catch(e => {
            return msg.invalidPayloadMsg(res)
        })
    } catch (e) {
        return msg.invalidPayloadMsg(res)
    }
}

const listFacultiesFromCollege = (req, res) => {
    try {
        faculties.find({
                "college_id": req.user.id,
                "banned": false
            }).limit(25)
            .then(FacultiesList => {
                if (!FacultiesList[0]) return res.send('No Faculties Found')
                studentData = FacultiesList.map(v, i => {
                    id = v._id
                    name = decrypt(v.faculty_name)
                    email = decrypt(v.faculty_email)
                    avatar = v.faculty_avatar || null
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
                return msg.invalidPayloadMsg(res)
            })
    } catch (e) {
        return msg.invalidPayloadMsg(res)
    }
}

const removeFacultyFromCollege = (req, res, opt) => {
    if (!(opt || opt.facultiesToRemove)) return msg.invalidPayloadMsg(res)
    try {
        opt.facultiesToRemove.forEach(v, i, a => {
            faculties.findOneAndUpdate({
                "college_id": req.user.id,
                "fauculty_id": v
            }, {
                "banned": true,
                "bannedBy": 'College'
            }).catch(e => {
                return msg.invalidPayloadMsg(res)
            })
            i === a.length - 1 ? msg.successResponseMsg(res, {
                response: "Successfully Banned Faculties"
            }) : ''
        })
    } catch (e) {
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
                opt.facultiesToAdd.forEach(v, i => {
                    if (!(v.facultyName && v.facultyEmail && v.facultyID)) return isAllFacultyInfoAvailable = false
                })
                if (!(isAllFacultyInfoAvailable)) return msg.invalidPayloadMsg(res)
                faculties.insertMany(opt.facultiesToAdd)
                    .then(d => {
                        console.log(d);
                        return msg.successResponseMsg(res, {
                            response: "Successfully Added Faculties"
                        })
                    })
                    .catch(e => {
                        return msg.invalidPayloadMsg(res)
                    })
            } catch (e) {
                return msg.invalidPayloadMsg(res)
            }
        }).catch(e => {
            return msg.invalidPayloadMsg(res)
        })
    } catch (e) {
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
    if(!(opt && opt.collegeDataToUpdate)) return msg.invalidPayloadMsg(res)
    try {
        colleges.findById(req.user.id).count().then(collegeData => {
            // if college does not exists
            if(!collegeData) return msg.invalidPayloadMsg(res)
            // if it does
            college_name = opt.collegeDataToUpdate.name
            avatar = opt.collegeDataToUpdate.avatar
            colleges.findOneAndUpdate({"_id": req.user.id},{college_name,avatar}).then(updatedData =>{
                msg.successResponseMsg(res, {
                    response: "Data Successfully Updated"
                })
            }).catch(err =>{
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

module.exports = {
    globalApiHandlers
}