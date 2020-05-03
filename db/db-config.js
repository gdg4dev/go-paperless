const mongoose = require('mongoose')
mongoose.set('debug', true)
    // mongoose.Promise = Promise
mongoose.connect(`${process.env.GP_MONGODB_URL}`, { useNewUrlParser: true })