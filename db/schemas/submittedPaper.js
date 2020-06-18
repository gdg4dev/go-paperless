const mongoose = require('mongoose')

const submittedPaperSchema = new mongoose.Schema({
    answer_id: {
        unique: true,
        required: true,
        type: String
    },
    student_id: {
        type: String,
        required: true
    },
    exam_id: {
        type: String,
        required: true
    },
    submission: Array
})
console.log('📗 Schemas Compiled....');
module.exports = mongoose.model('submitted_papers', submittedPaperSchema)