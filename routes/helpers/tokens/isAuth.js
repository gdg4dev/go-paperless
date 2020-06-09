const jwtR = require("jwt-redis").default;
const redis = require("redis");
const redisClient = redis.createClient();
const jwtr = new jwtR(redisClient);
const {
    exams,
    faculties
} = require('../../../db/dbs')

const {
    decrypt
} = require("../encryption/enc")
const notAuthorisedUserActions = (req, res, next) => {
    if (req.url.includes('/dashboard/college')) {
        return res.status(401).redirect('/core/login/c')
    } else if (req.url.includes('/dashboard/student')) {
        return res.status(401).redirect('/core/login/s')
    } else if (req.url.includes('/dashboard/faculty')) {
        return res.status(401).redirect('/core/login/f')
    } else if (req.url.includes('/dashboard/proctor')) {
        return res.status(401).redirect('/core/login/p')
    } else {
        return res.status(403).send(`<script>alert('Unauthorised Request')</script>`)
    }
}

const authorisedUserActionForLogin = (req, res, next) => {
    if (req.url == "/core/login/c" || req.url == "/core/login/s" || req.url == "/core/login/f" || req.url == "/core/login/p" || req.url.toString().includes("/core/register")) {
        if (req.user.acc_type === "college")
            return res.redirect("/dashboard/college");
        if (req.user.acc_type === "student")
            return res.redirect("/dashboard/student");
        if (req.user.acc_type === "faculty")
            return res.redirect("/dashboard/faculty");
        if (req.user.acc_type === "proctor")
            return res.redirect("/dashboard/proctor");
    }
}
const parseUserCookies = async (req, res, next) => {
    if (req.cookies && req.cookies.token) {
        let userToken = req.cookies.token.toString()
        console.log(userToken);
        try {
            const decoded = await jwtr.verify(userToken, process.env.GP_JWT_SIGN.toString())
            req.user = decoded.user
            req.jti = decoded.jti
            console.log(decoded);
            return next()
        } catch (e) {
            return notAuthorisedUserActions(req, res, next)
        }
    } else {
        return notAuthorisedUserActions(req, res, next)
    }
}

const inLoginPage = async (req, res, next) => {
    // console.log(`req =========================================== ${req}`);
    let token = req.cookies.token
    if (!token) return next();
    if (token == null || token == undefined || token == {}) return next()
    if (token) {
        // console.log(token);
        token = token.toString()
        try {
            let decoded
            try {
                decoded = await jwtr.verify(token, process.env.GP_JWT_SIGN.toString());
            } catch (e) {
                return next()
            }
            if (decoded) {
                req.user = decoded.user;
                req.jti = decoded.jti
                return authorisedUserActionForLogin(req, res, next)
            } else {
                return next()
            }

        } catch (e) {
            console.log(e);
            return next();
        }
    }
};

const performLogout = (req, res, next) => {
    console.log("logging out!");
    if (req.cookie.token) return jwtr.destroy(req.cookie.token.toString());
    else res.status(400).seperformAPIAuthnd();
};

const isLoggedIn = (req, res, next) => {
    let token
    try {
        token = req.cookies.token.toString();
    } catch (e) {
        return res
            .status(401)
            .send("<script>document.write('Please login to view this page')</script>");
    }
    if (!token)
        return res
            .status(401)
            .send("<script>document.write('Please login to view this page')</script>");
    try {
        const decoded = jwtr.verify(token, process.env.GP_JWT_SIGN.toString());
        req.user = decoded.user;
        req.jti = decoded.jti
        return next();
    } catch (e) {
        return res
            .status(400)
            .send("<script>document.write('Unauthorised Request')</script>");
    }
};

const isCollege = (req, res, next) => {
    if (req.user.acc_type === "college") return next();
    return res.send(`<script>alert('You Are Not Authorised To View This Page or Your Session Is No Longer Valid! Please Login');window.location="/core/login/c"</script>`);
};

const isStudent = (req, res, next) => {
    if (req.user.acc_type === "student") return next();
    return res.send(`<script>alert('You Are Not Authorised To View This Page or Your Session Is No Longer Valid! Please Login');window.location="/core/login/s"</script>`);
};

const isFaculty = (req, res, next) => {
    if (req.user.acc_type === "faculty") return next();
    return res.send(`<script>alert('You Are Not Authorised To View This Page or Your Session Is No Longer Valid! Please Login');window.location="/core/login/f"</script>`);
};

const isProctor = (req, res, next) => {
    if (req.user.acc_type === "proctor") return next();
    return res.send(`<script>alert('You Are Not Authorised To View This Page or Your Session Is No Longer Valid! Please Login');window.location="/core/login/p"</script>`);
};

const performAPIAuth = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        let token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = await jwtr.verify(token, process.env.GP_JWT_SIGN.toString())
            req.user = decoded.user
            req.jti = decoded.jti
            req.token = token
            return next()
        } catch (e) {
            return res.status(401).send({
                error: 1,
                code: 2202,
                message: "Invalid Request"
            });
        }
    }
    return res.status(401).send({
        error: 1,
        code: 2202,
        message: "Invalid Request"
    });
}


const examExists = (req, res, next) => {
    console.log('qswqd');
    if (req.params && req.params.examID) {
        exams.findOne({
            "exam_id": req.params.examID
        }).then(results => {
            console.log(results);
            if (!results) return res.status(401).send({
                error: 1,
                code: 2202,
                message: "Invalid Request"
            });
            faculties.findById(req.user.id).then(faculty => {
                req.exam = {}
                req.exam.id = results._id
                req.exam.type = results.type
                req.user.collegeName = decrypt(faculty.faculty_name),
                    req.user.avatarURL = faculty.avatar
                console.log(req.user);
                return next()
            }).catch(err => {
                console.log(err);
                return res.status(401).send({
                    error: 1,
                    code: 2202,
                    message: "Invalid Request"
                });
            })
        }).catch(err => {
            console.log(err);
            return res.status(401).send({
                error: 1,
                code: 2202,
                message: "Invalid Request"
            });
        })
    } else {
        return res.status(401).send({
            error: 1,
            code: 2202,
            message: "Invalid Request"
        });
    }
}

module.exports = {
    parseUserCookies,
    isLoggedIn,
    isCollege,
    isFaculty,
    isProctor,
    isStudent,
    inLoginPage,
    jwtr,
    performLogout,
    performAPIAuth,
    examExists
};