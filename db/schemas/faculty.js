const mongoose = require('mongoose')
const validator = require('validator').default

const facultySchema = new mongoose.Schema({
    faculty_id: {
        unique: true,
        required: true,
        type: String
    },
    college_id: {
        type: String,
        required: true
    },
    faculty_name: String,
    avatar: {
        type: String,
        default: '/assets/images/avatar.png'
    },
    faculty_email: {
        unique: true,
        trim: true,
        lowercase: true,
        type: Object
    },
    faculty_password: {
        type: String
    },
    faculty_phone: Object,
    registredOn: {
        type: Date,
        default: Date.now()
    },
    banned: {
        type: Boolean,
        default: false
    },
    bannedBy: String // two factor auth, phone, country code
})

module.exports = mongoose.model('faculty', facultySchema)