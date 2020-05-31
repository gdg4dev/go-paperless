const crypto = require("crypto-js");
const { colleges } = require("../../db/dbs");
const { verifyEmail, sendVerificationLink } = require("./mailVerfication");
const randomCrypto = require("crypto-random-string");
const jwt = require("jsonwebtoken");
const uploadHandler = require("./uploadHandlers");
const multiparty = require("multiparty");
const util = require("util");
// routes solver start

// // performs AES encryption
// const encrypt = (pt, key) => {
//     return crypto.AES.encrypt(pt.toString(), key).toString()
// }
const decrypt2 = (cipher, key) => {
  // console.log(` cipher: ${cipher}`);
  // console.log(` key: ${key}`);
  var Bytes = crypto.AES.decrypt(cipher.toString(), key);
  return Bytes.toString(crypto.enc.Utf8);
};

const encrypt = (pt, key) => {
  key = crypto.enc.Hex.parse(key);
  return crypto.AES.encrypt(pt, key, { mode: crypto.mode.ECB }).toString();
};

const decrypt = (cipher, key) => {
  key = crypto.enc.Hex.parse(key);
  return crypto.AES.decrypt(cipher.toString(), key, {
    mode: crypto.mode.ECB,
  }).toString(crypto.enc.Utf8);
};

exports.globalRegForm = function (req, res, next) {
  switch (req.params.type) {
    case "c":
      collegeRegForm(req, res, next);
      break;
    case "s":
      studentRegForm(req, res, next);
      break;
    case "f":
      facultyRegForm(req, res, next);
      break;
    default:
      res.status(404).send();
  }
};

exports.globalLoginForm = function (req, res, next) {
  switch (req.params.type) {
    case "c":
      collegeLoginForm(req, res, next);
      break;
    case "s":
      studentLoginForm(req, res, next);
      break;
    case "f":
      facultyLoginForm(req, res, next);
      break;
    case "p":
      proctorLoginForm(req, res, next);
      break;
    default:
      res.status(404).send();
  }
};

exports.globalReg = function (req, res, next) {
  switch (req.params.type) {
    case "c":
      registerCollege(req, res, next);
      break;
    case "s":
      registerStudent(req, res, next);
      break;
    case "f":
      registerFaculty(req, res, next);
      break;
    default:
      res.status(404).send();
  }
};

exports.globalLogin = function (req, res, next) {
  switch (req.params.type) {
    case "c":
      collegeLogin(req, res, next);
      break;
    case "s":
      studentLogin(req, res, next);
      break;
    case "f":
      facultyLogin(req, res, next);
      break;
    case "p":
      proctorLogin(req, res, next);
      break;
    default:
      res.status(404).send();
  }
};
// routes solver end

// login-form start
const collegeLoginForm = (req, res, next) => {
  res.status(200).render("collegeLoginForm");
};
const studentLoginForm = (req, res, next) => {
  res.status(200).render("studentLoginForm");
};
const facultyLoginForm = (req, res, next) => {
  res.status(200).render("facultyLoginForm");
};
const proctorLoginForm = (req, res, next) => {
  res.status(200).render("proctorLoginForm");
};
// login-form end

// reg-form end
const collegeRegForm = (req, res, next) => {
  res.status(200).render("registerCollege");
};
const studentRegForm = (req, res, next) => {
  res.status(200).render("registerStudent");
};
const facultyRegForm = (req, res, next) => {
  res.status(200).render("registerFaculty");
};
// reg-form end

// perform reg start
const registerCollege = (req, res, next) => {
  registerANewCollege(req, res, "colleges", "college_email");
};
const registerStudent = (req, res, next) => {
  // function
};
const registerFaculty = (req, res, next) => {
  // function
};
// perform reg end

// perform login start
const collegeLogin = (req, res, next) => {
  try {
    college_email = encrypt(
      decrypt2(req.body.email.toString(), `${process.env.GP_PUB_ENC_DEC_KEY}`),
      `${process.env.GP_PRIVATE_ENC_DEC_KEY}`
    );
    console.log(req.body.email);
    college_password = encrypt(
      decrypt2(req.body.pass.toString(), `${process.env.GP_PUB_ENC_DEC_KEY}`),
      `${process.env.GP_PRIVATE_ENC_DEC_KEY}`
    );
    colleges.find({ "college_email.emailAddr": college_email }).then((d) => {
      console.log(d);
      res.send(d);
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: 1, code: 400, message: "Bad Request" });
  }
};
const studentLogin = (req, res, next) => {
  // function
};
const facultyLogin = (req, res, next) => {
  // function
};
const proctorLogin = (req, res, next) => {
  // function
};
// perform login end

// gets all registers emails
const currentlyRegisteredEmails = function (collection, collectionField, cb) {
  eval(`${collection}.find({}).map(function(doc) {
        return doc.map(ab => ab.${collectionField}.emailAddr)
    }).then(cb)`);
};

// registers a new college account
const registerANewCollege = async (req, res, collection, collectionField) => {
  try {
    // decrypts college email, name and password
    decryptedEmail = decrypt2(
      req.body.email.toString(),
      `${process.env.GP_PUB_ENC_DEC_KEY}`
    );
    decryptedName = decrypt2(
      req.body.name.toString(),
      `${process.env.GP_PUB_ENC_DEC_KEY}`
    );
    decryptedPass = decrypt2(
      req.body.pass.toString(),
      `${process.env.GP_PUB_ENC_DEC_KEY}`
    );

    // verifies email (temp email ?)
    verifyEmail(
      encrypt(decryptedEmail, `${process.env.GP_PRIVATE_ENC_DEC_KEY}`),
      async (results) => {
        // after callback

        // checks if email already exists in database
        // gets email list
        currentlyRegisteredEmails(collection, collectionField, async (a) => {
          // checking if it exists
          // if it does
          console.log(a);
          if (
            a.indexOf(
              encrypt(decryptedEmail, `${process.env.GP_PRIVATE_ENC_DEC_KEY}`)
            ) >= 0
          ) {
            res.send(
              `var responseData ={msg: '<center>🤔 hmm.. Looks like we already have an account<br>registered with that email </center>'  }`
            );
          } else {
            // if it doesn't then checks for if it is temp email
            if (results.disposable === false) {
              // if it is not then sends verification link
              // encrypts college pass with different key
              dbClgPass = encrypt(
                decryptedPass,
                `${process.env.GP_PRIVATE_ENC_DEC_KEY}`
              );
              // email verification random token/secret 1
              secret1 = randomCrypto({
                length: 17,
                type: "url-safe",
              });
              // encrypts college name as token/secret 2
              secret2 = encrypt(
                encrypt(decryptedName, `${process.env.GP_PRIVATE_ENC_DEC_KEY}`),
                `${process.env.GP_PUB_ENC_DEC_KEY}`
              );
              // concats both token with " .. "
              secretRaw = `${secret1}..${secret2}`;
              secret = encodeURIComponent(secretRaw);
              // adds a new college in to database
              console.log(decryptedEmail);
              console.log(
                encrypt(decryptedEmail, `${process.env.GP_PRIVATE_ENC_DEC_KEY}`)
              );
              let college = colleges.create({
                college_id: secret1,
                college_name: encrypt(
                  decryptedName,
                  `${process.env.GP_PRIVATE_ENC_DEC_KEY}`
                ),
                college_email: {
                  emailAddr: encrypt(
                    decryptedEmail,
                    `${process.env.GP_PRIVATE_ENC_DEC_KEY}`
                  ),
                  verified: false,
                  secret,
                },
                college_password: dbClgPass,
              });
              college.save;
              // sends email verification link
              await sendVerificationLink(secret, decryptedEmail, "college");
              res.send(`
                                var responseData = { msg: '<center>🥳 Everything Looks Great! <br> Check Your E-mail For Further Instructions</center>' }
                                `);
            } else if (results.disposable === true) {
              // if it is temp mail
              res.send(`
                                var responseData = { msg: '🙁 Sorry, But We Hate Disposable E-mails' }
                                `);
            } else {
              // just cross check
              res.send(`
                                var responseData = { msg: '🤒 There Is Some Problem With Your E-mail' }
                                `);
            }
          }
        });
      }
    );
  } catch (e) {
    // just
    console.log(e);
    res.send(
      `var responseData = { msg: '🤒 There Is Some Problem With Your Request' }`
    );
  }
};

const registerANewStudent = async (req, res, collection, collectionField) => {
  try {
    decryptedName = decrypt2(
      req.body.name.toString(),
      `${process.env.GP_PUB_ENC_DEC_KEY}`
    );
    decryptedPass = decrypt2(
      req.body.pass.toString(),
      `${process.env.GP_PUB_ENC_DEC_KEY}`
    );
    accountPass = encrypt(
      decryptedPass,
      `${process.env.GP_PRIVATE_ENC_DEC_KEY}`
    );
    secretR = randomCrypto({
      length: 17,
      type: "url-safe",
    });
    secret1 = `${secretR} ${email}`;
    secret = randomCrypto({
      length: 20,
      type: "url-safe",
    });

    let college = colleges.create({
      college_id: secret1,
      college_name: decryptedName,
      college_email: {
        emailAddr: decryptedEmail,
        verified: false,
        secret,
      },
      college_password: accountPass,
    });
    college.save;
    // sends email verification link
    await sendVerificationLink(secret, decryptedEmail, "college");
    res.send(
      `var responseData = { nextFNC: alert('login success! redirecting you to login page....')`
    );
  } catch (e) {
    // just
    res.send({
      err: "Something Is Wrong With Request",
    });
  }
};

// performs college login
// exports.collegeLogin = (req, res) => {
//     const token = jwt.sign({
//         _id: user._id
//     }, process.env.GP_USR_TOKEN_SECRET, {
//         algorithm: 'PS512',
//         expiresIn: '12h'
//     })
//     res.header('auth_token', token)
//     res.render('registerCollege')
// }

exports.registerCollege = async (req, res) => {
  registerAccount(req, res, "colleges", "college_email");
};

exports.logout = (req, res) => {
  res.render("registerCollege");
};

module.exports = exports;
