const fetch = require('node-fetch')
const nodemailer = require("nodemailer");
const fs = require('fs')
const path = require('path')
const randomCrypto = require('crypto-random-string')
const { colleges } = require('../../db/dbs')
let emailTemplate = fs.readFileSync(path.join(`${__dirname}/../../templates/emails/email-verification.html.js`), { encoding: 'utf-8' })

const verifyEmail = async(email, checker) => {
    userEmail = encodeURIComponent(email)
    await fetch(`https://open.kickbox.com/v1/disposable/${userEmail}`)
        .then(res => res.json())
        .then(json => checker(json))
}

const sendVerificationLink = (secret, email, accType) => {
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
        } else if (accType === 'student') {
            urlVerificationRoute = 'secure/verification/s/'
        } else if (accType === 'faculty') {
            urlVerificationRoute = 'secure/verification/f/'
        } else if (accType === 'proctor') {
            urlVerificationRoute = 'secure/verification/p/'
        } else {
            urlVerificationRoute = 'anonymous/secure/verification/'
        }
        emailVerifiationKey = secret
        url = `${urlPrefix}${urlHost}${urlVerificationRoute}${emailVerifiationKey}`
        eval(emailTemplate)
        await transporter.sendMail({
            from: 'no-reply@go-paperless.com',
            to: email,
            subject: "Email Verification",
            html: `${emvt}`
        });

    }
    main().catch(console.log({ "msg": "some unknown error occured while sending mail" }));
}

const checkMailLink = (secret, newSecret, collectionName, collectionField, cb) => {
    // colleges.find({ "college_email.secret": "NImiQg7rlsbQpPGwDCov2Iu_Sj4tio" }, { "_id": 1 }, async(err, d) => {
    //     try {
    //         await colleges.update({ _id: d[0]._id.toString() }, {
    //             $set: {
    //                 "college_email.verified": true,
    //                 "college_email.secret": newSecret
    //             }
    //         }, (err, doc) => console.log(doc))
    //         cb("res.send('<script>alert('your account is activated!you can now login!🥳')</script>')")
    //     } catch (e) {
    //         cb("res.status(404).send('REQUESTED PAGE NOT FOUND')")
    //     }
    // })
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
                    cb("res.status(404).send('REQUESTED PAGE NOT FOUND')")
                }
            } catch (e) {
                console.log(e)
                cb("res.status(404).send('REQUESTED PAGE NOT FOUND')")
            }
        })`)
}
const emailVerifyAPI = (req, res) => {
console.log(req.params)
    if (req.params.secret && req.params.accountType) {
        newSecret = randomCrypto({ length: 32, type: 'url-safe' })
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
module.exports = { verifyEmail, sendVerificationLink, emailVerifyAPI }