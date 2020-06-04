const mongoose = require('mongoose')
const validator = require('validator').default
const collegeSchema = new mongoose.Schema({
    college_id: {
        unique: true,
        required: true,
        type: String
    },
    college_name: String,
    avatar: {
        type: String,
        default: '/assets/images/avatar.png'
    },
    college_email: {
        trim: true,
        lowercase: true,
        type: Object,
        unique: true
    },
    college_password: {
        type: String
    },
    college_faculties: Object,
    college_students: Object,
    college_phone: Object,
    registredOn: {
        type: Date,
        default: Date.now()
    } // two fact auth, number
})

module.exports = mongoose.model('colleges', collegeSchema)