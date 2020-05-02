const mongoose = require('mongoose')
const validator = require('validator').default
const passwordValidator = require('password-validator')
const isValidPass = new passwordValidator()
isValidPass
    .is().min(9)
    .is().max(50)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces()
    .is().not().oneOf(['password', '12345678'])

const studnetsSchema = new mongoose.Schema({
    student_id: {
        unique: true,
        required: true,
        type: Number
    },
    college_id: String,
    student_name: String,
    student_avatar: String,
    student_email: {
        trim: true,
        unique: true,
        required: true,
        lowercase: true,
        type: String,
        validate(userEmail) {
            if (!validator.isEmail(userEmail)) {
                throw new Error('Please enter valid email address')
            }
        }
    },
    student_password: {
        required: true,
        type: String,
        validate(userPass) {
            if (!isValidPass(userPass)) {
                throw new Error('Please enter a strong password')
            }
        }
    },
    student_phone: Object // two factor auth, phone, country code
})

module.exports = mongoose.model('students', studnetsSchema)