const fetch = require('node-fetch')
const nodemailer = require("nodemailer");
const fs = require('fs')
const path = require('path')
const randomCrypto = require('crypto-random-string')
const {
    colleges,
    students,
    faculties,
    proctors
} = require('../../db/dbs')
let emailTemplate = fs.readFileSync(path.join(`${__dirname}/../../templates/emails/email-verification.html.js`), {
    encoding: 'utf-8'
})
let emailTemplate2 = fs.readFileSync(path.join(`${__dirname}/../../templates/emails/tmp-mail-err-to-clg.js`), {
    encoding: 'utf-8'
})
const verifyEmail = async (email, checker) => {
    domain = email.split('@')[1]
    userEmail = encodeURIComponent(`user@${domain}`)
    await fetch(`https://open.kickbox.com/v1/disposable/${userEmail}`)
        .then(res => res.json())
        .then(json => checker(json))
}

const sendVerificationLink = (secret, email, accType, password) => {
    async function main() {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: `${process.env.GP_GMAIL_SMTP_EMAIL}`,
                pass: `${process.env.GP_GMAIL_SMTP_PASS}`
            }
        });
        urlPrefix = `${process.env.GP_URL_PREFIX}`
        urlHost = `${process.env.GP_HOST}`
        if (accType === 'college') {
            urlVerificationRoute = 'secure/verification/c/'
            loginRoute = 'core/login/c/'
        } else if (accType === 'student') {
            urlVerificationRoute = 'secure/verification/s/'
            loginRoute = 'core/login/s/'
        } else if (accType === 'faculty') {
            urlVerificationRoute = 'secure/verification/f/'
            loginRoute = 'core/login/f/'
        } else if (accType === 'proctor') {
            urlVerificationRoute = 'secure/verification/p/'
            loginRoute = 'core/login/p/'
        } else {
            urlVerificationRoute = 'anonymous/secure/verification/'
        }
        emailVerifiationKey = secret
        url = `${urlPrefix}${urlHost}${urlVerificationRoute}${emailVerifiationKey}`
        eval(emailTemplate)
        if (accType === 'college') {
            await transporter.sendMail({
                from: 'no-reply@go-paperless.com',
                to: email,
                subject: "Email Verification",
                html: `${emvt}`
            });
        } else {
            await transporter.sendMail({
                from: 'no-reply@go-paperless.com',
                to: email,
                subject: "Email Verification",
                html: `${userMailTmplt}`
            });
        }


    }
    main().catch(e => console.log({
        "msg": "some unknown error occured while sending mail",
        error: e
    }));
}

const checkMailLink = (secret, newSecret, collectionName, collectionField, cb) => {
    console.log(secret)
    eval(`${collectionName}.find({ "${collectionField}.secret": "${secret}" }, { "_id": 1 }, async(err, d) => {
        
        console.log(d)    
        try {
                if(d[0]){
                    await ${collectionName}.update({ _id: d[0]._id.toString() }, {
                       $set: {
                            "${collectionField}.verified": true,
                           "${collectionField}.secret": "${newSecret}"
                         }
                  }, (err, doc) => {console.log(doc)})
                     cb("res.send('<script>alert(\`your account is activated! you can now login!🥳\`)</script>')")
                } else {
                    cb("res.status(404).send()")
                }
            } catch (e) {
                console.log(e)
                cb("res.status(404).send()")
            }
        })`)
}
const emailVerifyAPI = (req, res) => {
    console.log(req.params)
    if (req.params.secret && req.params.accountType) {
        newSecret = randomCrypto({
            length: 32,
            type: 'url-safe'
        })
        secret = encodeURIComponent(req.params.secret)
        if (req.params.accountType === 'c') {
            checkMailLink(secret, newSecret, 'colleges', 'college_email', (log) => {
                eval(log)
            })
        } else if (req.params.accountType === 'f') {
            checkMailLink(secret, newSecret, 'faculties', 'faculty_email', (log) => {
                eval(log)
            })
        } else if (req.params.accountType === 'p') {
            checkMailLink(secret, newSecret, 'proctors', 'proctor_email', (log) => {
                eval(log)
            })
        } else if (req.params.accountType === 's') {
            checkMailLink(secret, newSecret, 'students', 'student_email', (log) => {
                eval(log)
            })
        }
    } else {
        res.status(404).send('REQUESTED PAGE NOT FOUND')
    }
}

sendTempMailErrorToCollege = async (type, userEmail, collegeEmail) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: `${process.env.GP_GMAIL_SMTP_EMAIL}`,
            pass: `${process.env.GP_GMAIL_SMTP_PASS}`
        }
    });
    usrType = type
    stuEmail = userEmail
    eval(emailTemplate2)
    await transporter.sendMail({
        from: 'no-reply@go-paperless.com',
        to: collegeEmail,
        subject: "Email Error",
        html: `${tmpMailErrTmplt}`
    });
}
sendVerificationLinkToUser = (type, mail, secret, pass) => {
    return sendVerificationLink(secret, mail, type, pass)
}
module.exports = {
    verifyEmail,
    sendVerificationLink,
    emailVerifyAPI,
    sendTempMailErrorToCollege,
    sendVerificationLinkToUser

}