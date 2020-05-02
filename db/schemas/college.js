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

const collegeSchema = new mongoose.Schema({
    college_id: {
        unique: true,
        required: true,
        type: Number
    },
    college_name: String,
    college_avatar: String,
    college_email: {
        trim: true,
        lowercase: true,
        type: String,
        unique: true,
        validate(userEmail) {
            if (!validator.isEmail(userEmail)) {
                throw new Error('Please enter valid email address')
            }
        }
    },
    college_password: {
        type: String,
        validate(userPass) {
            if (!isValidPass(userPass)) {
                throw new Error('Please enter a strong password')
            }
        }
    },
    college_faculties: Object,
    college_students: Object,
    college_phone: Object // two fact auth, number
})

module.exports = mongoose.model('colleges', collegeSchema)