const mongoose = require('mongoose')
const examsSchema = new mongoose.Schema({
    exam_id: {
        unique: true,
        required: true,
        type: Number
    },
    college_id: {type:String,required: true},
    faculty_id: String,
    exam_date: Date,
    questions: Object,
    exam_details: Object,
    createdOn: {
        type: Date,
        default: Date.now()
    }//exam type, passing marks, total marks, students
})

module.exports = mongoose.model('exams', examsSchema)