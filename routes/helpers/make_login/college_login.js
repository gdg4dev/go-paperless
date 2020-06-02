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
    colleges
} = require("../../../db/dbs");
const {
    jwtr
} = require("../tokens/isAuth");

module.exports = (req, res, next) => {
    try {
        college_email = toPrivateData(req.body.email);
        college_password = toPrivateData(req.body.pass);
        colleges
            .find({
                "college_email.emailAddr": college_email
            })
            .then(async (d) => {
                if (d[0]) {
                    if (d[0].college_password === college_password) {
                        if (d[0].college_email.verified) {
                            user = {
                                id: d[0]._id,
                                email: d[0].college_email.emailAddr,
                                name: d[0].college_name,
                                acc_type: "college",
                            };
                            token = await require("../tokens/generateLoginToken")(user);
                            console.log("token == " + token);
                            await res.cookie("token", token, {
                                httpOnly: true
                            });
                            return await res.status(200).send(lMsg.collegeLoginSuccess);
                        } else {
                            return res.status(403).send(lMsg.emailVerificationPending);
                        }
                    } else {
                        console.log("password mismatch");
                        return res.status(403).send(lMsg.invalidLogin);
                    }
                } else {
                    console.log("account not found");
                    res.status(403).send(lMsg.invalidLogin);
                }
            });
    } catch (e) {
        console.log(e);
        res.status(400).send(lMsg.badRequest);
    }
};