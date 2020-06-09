const cron = require('node-cron')
const {
    students,
    faculties,
    proctors,
    colleges
} = require('../../../db/dbs')
const {
    toPrivateData,
    decrypt,
    encrypt
} = require('../encryption/enc')
const {sendTempMailErrorToCollege,
sendVerificationLinkToUser,verifyEmail} = require('../mailVerfication')

cron.schedule('10 * * * * *', () => {
    console.log('called');
    students.find({
        "student_email.sent": false
    }).then((studentList) => {
        if(!studentList[0]) return
        studentList.forEach(student => {
            decMail = decrypt(student.student_email.emailAddr)
            verifyEmail(decMail, (results) => {
                if (results.disposable) {
                    return colleges.findById(student.college_id).then(college =>{
                        collegeEmail = decrypt(college.college_email.emailAddr)
                        students.findByIdAndUpdate(student._id,{"student_email.sent": true}).then(d=>console.log('done' + d))
                        return sendTempMailErrorToCollege('student', decMail, collegeEmail)
                    })
                } 
                stuPass = decrypt(student.student_password)
                console.log(student._id);
                students.findByIdAndUpdate(student._id,{"student_email.sent": true}).then(d=>console.log('done' + d))
                return sendVerificationLinkToUser('student',decMail,student.student_email.secret,stuPass)
            })
        })
    }).catch(e => console.log(`StuEmail Cron Error: ${e}`))
})

cron.schedule('10 * * * * *', () => {
    faculties.find({
        "faculty_email.sent": false
    }).then((facultyList) => {
        if(!facultyList[0]) return
        facultyList.forEach(faculty => {
            decMail = decrypt(faculty.faculty_email.emailAddr)
            verifyEmail(decMail, (results) => {
                if (results.disposable) {
                    return colleges.findById(faculty.college_id).then(college =>{
                        collegeEmail = decrypt(college.college_email.emailAddr)
                        faculties.findByIdAndUpdate(faculty._id,{"faculty_email.sent": true}).then(d=>console.log('done' + d))
                        return sendTempMailErrorToCollege('faculty', decMail, collegeEmail)
                    })
                } 
                facPass = decrypt(faculty.faculty_password)
                faculties.findByIdAndUpdate(faculty._id,{"faculty_email.sent": true}).then(d=>console.log('done' + d))
                return sendVerificationLinkToUser('faculty',decMail,faculty.faculty_email.secret, facPass)
            })
        })
    }).catch(e => console.log(`FacEmail Cron Error: ${e}`))
})

cron.schedule('10 * * * * *', () => {
    proctors.find({
        "proctor_email.sent": false
    }).then((proctorList) => {
        if(!proctorList[0]) return
        proctorList.forEach(proctor => {
            decMail = decrypt(proctor.proctor_email.emailAddr)
            verifyEmail(decMail, (results) => {
                if (results.disposable) {
                    return colleges.findById(proctor.college_id).then(college =>{
                        collegeEmail = decrypt(college.college_email.emailAddr)
                        proctors.findByIdAndUpdate(proctor._id, {"proctor_email.sent": true}).then(d=>console.log('done' + d))
                        return sendTempMailErrorToCollege('student', decMail, collegeEmail)
                    })
                } 
                stuPass = decrypt(proctor.proctor_password)
                proctors.findByIdAndUpdate(proctor._id, {"proctor_email.sent": true}).then(d=>console.log('done' + d))
                return sendVerificationLinkToUser('proctor',decMail,proctor.proctor_email.secret,procPass)
            })
        })
    }).catch(e => console.log(`ProcEmail Cron Error: ${e}`))
})

// crash browser
// inducebrowsercrashforrealz