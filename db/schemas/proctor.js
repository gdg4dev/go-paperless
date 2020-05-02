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

const proctorSchema = new mongoose.Schema({
    proctor_id: {
        unique: true,
        required: true,
        type: Number
    },
    proctor_name: String,
    proctor_avatar: String,
    proctor_email: {
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
    proctor_password: {
        type: String,
        validate(userPass) {
            if (!isValidPass(userPass)) {
                throw new Error('Please enter a strong password')
            }
        }
    },
    previously_proctored: Object,
    currently_proctoring: Object,
    upcoming_to_proctor: Object,
    suspended_students: Object,
    proctor_phone: Object // two factor auth, phone, country code
})

module.exports = mongoose.model('proctors', proctorSchema)