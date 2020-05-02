const mongoose = require('mongoose')
const resultsSchema = new mongoose.Schema({
    result_id: {
        unique: true,
        required: true,
        type: Number
    },
    exam_id: {
        type: String,
        required: true
    },
    student_id: {
        type: String,
        required: true
    },
    exam_paper_details: Object, //type of exam,total marks, passing marks, marks gained
    answers: Object // question,answer,marks,reasons
})

module.exports = mongoose.model('results', resultsSchema)