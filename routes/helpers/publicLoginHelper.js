const crypto = require('crypto-js')
const { colleges } = require('../../db/dbs')
const { verifyEmail, sendVerificationLink } = require('./mailVerfication')
const randomCrypto = require('crypto-random-string')

const decrypt = (cipher, key) => {
    var Bytes = crypto.AES.decrypt(cipher.toString(), key);
    return Bytes.toString(crypto.enc.Utf8);
}
const encrypt = (pt, key) => {
    return crypto.AES.encrypt(pt.toString(), key).toString()
}

const currentlyRegisteredEmails = function(cb) {
    colleges.find({}).map(function(doc) {
        return doc.map(ab => ab.college_email.emailAddr)
    }).then(cb)
}

exports.collegeRegForm = (req, res) => {
    res.render('registerCollege')
}
exports.collegeLogin = (req, res) => {
    res.render('registerCollege')
}

exports.registerCollege = async(req, res) => {
    try {
        // console.log(currentlyRegisteredEmails('colleges', 'college_email.emailAddr'))
        decryptedEmail = decrypt(req.body.email.toString(), `${process.env.GP_PUB_ENC_DEC_KEY}`)
        decryptedName = decrypt(req.body.name.toString(), `${process.env.GP_PUB_ENC_DEC_KEY}`)
        decryptedPass = decrypt(req.body.pass.toString(), `${process.env.GP_PUB_ENC_DEC_KEY}`)

        verifyEmail(decryptedEmail, async(results) => {
            dbClgPass = encrypt(decryptedPass, `${process.env.GP_PRIVATE_ENC_DEC_KEY}`)
            secret1 = randomCrypto({ length: 12, type: 'url-safe' })
            secret2 = encrypt(decryptedName, `${process.env.GP_PRIVATE_ENC_DEC_KEY}`)
            secret = `${secret1}..${secret2.replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32').replace('?', 'mAbui').replace('&', 'YCbhmj')}`
            currentlyRegisteredEmails(async a => {
                if (a.indexOf(decryptedEmail) >= 0) {
                    res.send(`var responseData ={msg: '<center>🤔 hmm.. Looks like we already have an account<br>registered with that email </center>'  }`)
                } else {
                    if (results.disposable === false) {
                        let college = colleges.create({
                            college_id: secret1,
                            college_name: decryptedName,
                            college_email: {
                                emailAddr: decryptedEmail,
                                verified: false,
                                secret
                            },
                            college_password: dbClgPass
                        });
                        college.save
                        await sendVerificationLink(secret, decryptedEmail, (a) => {

                            console.log(a)
                        })
                        res.send(`
                                var responseData = { msg: '<center>🥳 Everything Looks Great! <br> Check Your E-mail For Further Instructions</center>' }
                                `)
                    } else if (results.disposable === true) {
                        res.send(`
                                var responseData = { msg: '🙁 Sorry, But We Hate Disposable E-mails' }
                                `)
                    } else {
                        console.log(decryptedEmail)
                        res.send(`
                                var responseData = { msg: '🤒 There Is Some Problem With Your E-mail' }
                                `)
                    }
                }
            })
        })
    } catch (e) {
        res.send({ "err": "Something Is Wrong With Request" })
    }
}
exports.logout = (req, res) => {
    res.render('registerCollege')
}

exports.emailVerifyAPI = (req, res) => {
    if (req.params.secret) {
        secret = req.params.secret
        colleges.find({ "college_email.secret": secret }, { "_id": 1 }, (err, d) => {
            colleges.update({ _id: d[0]._id.toString() }, {
                $set: {
                    "college_email": { $set: { "verified": true } }
                }
            }, (err, doc) => console.log(doc))
        })

        // colleges.findOneAndUpdate({ "college_email.emailAddr": secret }, {
        //     $set: {
        //         college_email: { verified: true }
        //     }
        // })
    } else {

        res.status(500).send()
    }
}
module.exports = exports