const mongoose = require('mongoose')
const validator = require('validator').default
const studnetsSchema = new mongoose.Schema({
    student_id: {
        unique: true,
        required: true,
        type: String
    },
    college_id: String,
    student_name: String,
    student_avatar: String,
    student_email: {
        trim: true,
        unique: true,
        required: true,
        lowercase: true,
        type: Object
    },
    student_password: {
        required: true,
        type: String
    },
    student_phone: Object // two factor auth, phone, country code
})

module.exports = mongoose.model('students', studnetsSchema)