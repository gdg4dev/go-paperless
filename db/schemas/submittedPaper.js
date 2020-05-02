const mongoose = require('mongoose')
const submittedPaperSchema = new mongoose.Schema({
    answer_id: {
        unique: true,
        required: true,
        type: Number
    },
    student_id: {
        type: Number,
        required: true
    },
    exam_id: {
        type: Number,
        required: true
    },
    submission: Object
})

module.exports = mongoose.model('submitted_papers', submittedPaperSchema)