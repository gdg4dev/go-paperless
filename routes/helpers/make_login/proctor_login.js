const lMsg = require("../messages/loginMessages");
const {
    toPublicData,
    toPrivateData,
    decrypt,
    encrypt,
    decrypt2,
    encrypt2,
} = require("../encryption/enc");
const {
    colleges,
    proctors
} = require("../../../db/dbs");
const {
    jwtr
} = require("../tokens/isAuth");

module.exports = (req, res, next) => {
    try {
        proctor_email = toPrivateData(req.body.email);
        proctor_password = toPrivateData(req.body.pass);
        proctors
            .find({
                "proctor_email.emailAddr": proctor_email
            })
            .then(async (d) => {
                if (d[0]) {
                    if (d[0].proctor_password === proctor_password) {
                        if (d[0].proctor_email.verified) {
                            user = {
                                id: d[0]._id,
                                email: d[0].proctor_email.emailAddr,
                                name: d[0].proctor_name,
                                acc_type: "proctor",
                            };
                            token = await require("../tokens/generateLoginToken")(user);
                            var expiryDate = new Date(Number(new Date()) +  7 * 24 * 60 * 60 * 1000); // 1week
                            await res.cookie("token", token, {
                                // httpOnly: true,
                                expires: expiryDate
                            });
                            return await res.status(200).send(lMsg.proctorLoginSuccess);
                        } else {
                            return res.status(403).send(lMsg.emailVerificationPending);
                        }
                    } else {
                        console.log("password mismatch");
                        return res.status(403).send(lMsg.invalidLogin);
                    }
                } else {
                    console.log("account not found");
                    return res.status(403).send(lMsg.invalidLogin);
                }
            });
    } catch (e) {
        console.log(e);
        return res.status(400).send(lMsg.badRequest);
    }
};