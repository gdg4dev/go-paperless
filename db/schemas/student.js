const mongoose = require('mongoose')
const validator = require('validator').default
const studnetsSchema = new mongoose.Schema({
    student_id: {
        unique: true,
        required: true,
        type: String
    },
    college_id: {
        type: String,
        required: true
        },
    student_name: String,
    avatar: {
        type: String,
        default: '/assets/images/avatar.png'
    },
    student_email: {
        trim: true,
        unique: true,   
        required: true,
        lowercase: true,
        type: Object
    },
    student_password: {
        required: true,
        type: String,
    },
    student_phone: Object,
    registredOn: {
        type: Date,
        default: Date.now()
    },
    banned: {
        type: Boolean,
        default: false
    },
    bannedBy: String,
    upcoming_exams: Array,
    previous_exams: Array,
    participated: Array
     // two factor auth, phone, country code
})

module.exports = mongoose.model('students', studnetsSchema)