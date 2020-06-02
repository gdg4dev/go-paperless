// const jwt = require('jsonwebtoken')
const {
    jwtr
} = require("../tokens/isAuth");

module.exports = async (user) => {
    const signature = process.env.GP_JWT_SIGN.toString();
    const expiration = "168h"; // 1week
    genToken = await jwtr
        .sign({
            user
        }, signature, {
            expiresIn: expiration
        })
        .then((token) => {
            return token
        });
    return genToken
};