module.exports = {
    collegeLoginSuccess: {
        error: 0,
        code: 200,
        message: "Success",
        NEXT: `responseData = function(){
                  alert('Success! Redirecting You To Login....')
                    window.location = '/dashboard/college'
                }`
    },
    studentLoginSuccess: {
        error: 0,
        code: 200,
        message: "Success",
        NEXT: `responseData = function(){
                  alert('Success! Redirecting You To Login....')
                    window.location = '/dashboard/student'
                }`
    },
    facultyLoginSuccess: {
        error: 0,
        code: 200,
        message: "Success",
        NEXT: `responseData = function(){
                  alert('Success! Redirecting You To Login....')
                    window.location = '/dashboard/faculty'
                }`
    },
    proctorLoginSuccess: {
        error: 0,
        code: 200,
        message: "Success",
        NEXT: `responseData = function(){
                  alert('Success! Redirecting You To Login....')
                    window.location = '/dashboard/proctor'
                }`
    },
    emailVerificationPending: {
        error: 5083,
        code: 403,
        message: "Email Verification Pending",
    },
    invalidLogin: {
        error: 4023, // credentials mismatch
        code: 403,
        message: "Login Invalid!",
    },
    badRequest:{ error: 1, code: 400, message: "Bad Request" }
}