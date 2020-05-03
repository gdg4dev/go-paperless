const mongoose = require('mongoose')
const validator = require('validator').default
const collegeSchema = new mongoose.Schema({
    college_id: {
        unique: true,
        required: true,
        type: String
    },
    college_name: String,
    college_avatar: String,
    college_email: {
        trim: true,
        lowercase: true,
        type: Object,
        unique: true,
        validate(userEmail) {
            if (!validator.isEmail(userEmail.emailAddr)) {
                throw new Error('Please enter valid email address')
            }
        }
    },
    college_password: {
        type: String
    },
    college_faculties: Object,
    college_students: Object,
    college_phone: Object // two fact auth, number
})

module.exports = mongoose.model('colleges', collegeSchema)