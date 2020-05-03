const mongoose = require('mongoose')
const mongoDB = `"${process.env.GP_MONGODB_URL}"`
mongoose.set('debug', true)
    // mongoose.Promise = Promise
mongoose.connect(mongoDB, { useNewUrlParser: true })