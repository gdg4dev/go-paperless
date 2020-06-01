const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const {
  toPublicData,
  toPrivateData,
  colleges,
} = require("./publicLoginHelper");

mailVerificationPendingJson ={
    error: 5083, // mail verification pending
    code: 403,
    message: "Email Verification Pending",
    NEXT: `responseData = ()=>{alert('Email Verification Pending')}`
  }
successJson = {
error: 0,
code: 200,
message: "Success",
NEXT: `responseData = ()=>{
                    alert('Success! Redirecting You To Login....')
                      window.location = '/dashboard/college'
                  }`,
}

failJson = {
error: 4023,
code: 403,
message: "Login Invalid",
NEXT: "responseData = ()=>alert('Login Invalid')",
}

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "pass" },
      (email, pass, done) => {
        privateEmail = toPrivateData(email);
        colleges
          .findOne({ "college_email.emailAddr": privateEmail })
          .then((user) => {
            if (!user) return done(1, false, failJson);
            privatePassword = toPrivateData(pass);
            if (
              user.college_email.emailAddr === privateEmail &&
              user.college_password === privatePassword
            ) {
              if (!user.college_email.verified)
                return done(null, false, mailVerificationPendingJson);
              user.account_type = 'college'
              return done(null, user, successJson);
            } else {
              return done(1, false, failJson);
            }
          })
          .catch((err) => console.log(err));
      }
    )
  );
};

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  colleges.findById(id, function (err, user) {
    done(err, user);
  });
});
