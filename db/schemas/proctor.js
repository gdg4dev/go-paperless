const mongoose = require('mongoose')
const validator = require('validator').default

const proctorSchema = new mongoose.Schema({
    proctor_id: {
        unique: true,
        required: true,
        type: String
    },
    proctor_name: String,
    proctor_avatar: String,
    proctor_email: {
        trim: true,
        lowercase: true,
        type: Object,
        unique: true
    },
    proctor_password: {
        type: String
    },
    previously_proctored: Object,
    currently_proctoring: Object,
    upcoming_to_proctor: Object,
    suspended_students: Object,
    proctor_phone: Object // two factor auth, phone, country code
})

module.exports = mongoose.model('proctors', proctorSchema)