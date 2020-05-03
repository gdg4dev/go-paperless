const fetch = require('node-fetch')
const nodemailer = require("nodemailer");
const fs = require('fs')
const path = require('path')
let emailTemplate = fs.readFileSync(path.join(`${__dirname}/../../templates/emails/email-verification.html.js`), { encoding: 'utf-8' })

const verifyEmail = async(email, checker) => {
    userEmail = encodeURIComponent(email)
    console.log(userEmail)
    await fetch(`https://open.kickbox.com/v1/disposable/${userEmail}`)
        .then(res => res.json())
        .then(json => checker(json))
}


const sendVerificationLink = (secret, email, cb) => {
    async function main() {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: `"${process.env.GP_GMAIL_SMTP_EMAIL}"`,
                pass: `"${process.env.GP_GMAIL_SMTP_PASS}"`
            }
        });
        urlPrefix = `"${process.env.GP_URL_PREFIX}"`
        urlHost = `"${process.env.GP_HOST}"`
        urlVerificationRoute = 'secure/verification/'
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
    cb('done')
}
module.exports = { verifyEmail, sendVerificationLink }