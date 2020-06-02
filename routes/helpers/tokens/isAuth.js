const jwtR = require("jwt-redis").default;
const redis = require("redis");
const redisClient = redis.createClient();
const jwtr = new jwtR(redisClient);

const notAuthorisedUserActions = (req,res,next) =>{
    if(req.url.includes('/dashboard/college')){
        res.status(401).redirect('/core/login/c')
    } else if(req.url.includes('/dashboard/student')){
        res.status(401).redirect('/core/login/s')
    } else if(req.url.includes('/dashboard/faculty')){
        res.status(401).redirect('/core/login/f')
    } else if(req.url.includes('/dashboard/proctor')){
        res.status(401).redirect('/core/login/p')
    } else {
        res.status(403).send(`<script>alert('Unauthorised Request')</script>`)
    }
}

const authorisedUserActionForLogin = (req,res,next)=>{
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
const parseUserCookies = async (req,res,next) =>{
    if (req.cookies && req.cookies.token){
        let userToken = req.cookies.token.toString()
        console.log(userToken);
        try{
            const decoded = await jwtr.verify(userToken,process.env.GP_JWT_SIGN.toString())
            req.user = decoded.user
            return next()
        } catch (e) {
            return notAuthorisedUserActions(req,res,next)
        }
    } else {
        return notAuthorisedUserActions(req,res,next)
    }
}

const inLoginPage = async (req, res, next) => {
    console.log(`req =========================================== ${req}`);
    let token = req.cookies.token
    if (!token) return next();
    if (token == null || token == undefined || token == {}) return next()
    if (token) {
        console.log(token);
        token = token.toString()
        try {
            if (jwtr.verify(token, process.env.GP_JWT_SIGN.toString())) {
                const decoded = await jwtr.verify(token, process.env.GP_JWT_SIGN.toString());
                req.user = decoded.user;
                authorisedUserActionForLogin(req,res,next)
            }
        } catch (e) {
            console.log(e);
            next();
        }
    }
};

const performLogout = (req, res, next) => {
    console.log("logging out!");
    if (req.cookie.token) return jwtr.destroy(req.cookie.token.toString());
    else res.status(400).send();
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

module.exports = {
    parseUserCookies,
    isLoggedIn,
    isCollege,
    isFaculty,
    isProctor,
    isStudent,
    inLoginPage,
    jwtr,
    performLogout
};