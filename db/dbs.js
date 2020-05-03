const students = require('./schemas/student')
const faculties = require('./schemas/faculty')
const colleges = require('./schemas/college')
const exams = require('./schemas/exams')
const proctors = require('./schemas/proctor')
const results = require('./schemas/results')
const submittedPapers = require('./schemas/submittedPaper')

module.exports = { students, faculties, colleges, exams, proctors, results, submittedPapers }