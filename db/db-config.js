const mongoose = require('mongoose')
    // mongoose.Promise = Promise
mongoose.connect(`${process.env.GP_MONGODB_URL}`, { useNewUrlParser: true })