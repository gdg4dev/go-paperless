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

const facultySchema = new mongoose.Schema({
    faculty_id: {
        unique: true,
        required: true,
        type: Number
    },
    college_id: String,
    faculty_name: String,
    faculty_avatar: String,
    faculty_email: {
        trim: true,
        lowercase: true,
        type: String,
        validate(userEmail) {
            if (!validator.isEmail(userEmail)) {
                throw new Error('Please enter valid email address')
            }
        }
    },
    faculty_password: {
        type: String,
        validate(userPass) {
            if (!isValidPass(userPass)) {
                throw new Error('Please enter a strong password')
            }
        }
    }
})

module.exports = mongoose.model('faculty', facultySchema)