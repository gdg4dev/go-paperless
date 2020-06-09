const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
    // mongoose.Promise = Promise
mongoose.connect(`${process.env.GP_MONGODB_URL}`, { useNewUrlParser: true })