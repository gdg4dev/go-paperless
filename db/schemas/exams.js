const mongoose = require('mongoose')
const examsSchema = new mongoose.Schema({
    exam_id: {
        unique: true,
        required: true,
        type:   String
    },
    college_id: {type:String,required: true},
    faculty_id: String,
    date: String,
    endDateTime: String,
    questions: Object,
    name: String,
    instructions: String,
    details: Object,
    createdOn: {
        type: Date,
        default: Date.now()
    },
    type: String,
    participants: Array,
    duration: Number,
    proctors: Array
    //exam type, passing marks, total marks, students
})

module.exports = mongoose.model('exams', examsSchema)