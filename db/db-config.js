const mongoose = require('mongoose')
const mongoDB = 'mongodb://127.0.0.1/go-paperless'
mongoose.set('debug', true)
mongoose.Promise = Promise
mongoose.connect(mongoDB, { useNewUrlParser: true })