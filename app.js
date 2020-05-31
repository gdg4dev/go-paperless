require('dotenv').config()
require('./private/admin-json-generator')
const express = require('express')
const app = express()
const hbs = require('hbs')
const path = require('path')
const compression = require('compression')
const viewPath = path.join(__dirname, './templates/views')
const partialsPath = path.join(__dirname, './templates/partials')
const publicPath = path.join(__dirname, './public')
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser')
const adminRoutes = require('./routes/admin');
const publicLoginRoutes = require('./routes/login')
const session = require('express-session')
// collections
require('./db/db-config')   
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded())
app.use(compression())
// app.use(express.json())
app.use(express.static(publicPath))
hbs.registerPartials(partialsPath)
app.set('view engine', 'hbs')
app.set('views', viewPath)
app.use(session({
    secret: `${process.env.GP_EXPRESS_SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false
}))

// app.use(bodyParser.json());
app.use(express.json());
app.use('/admin', adminRoutes)
app.use('/', publicLoginRoutes)
app.get('*', (req, res) => {
    res.status('404').send()
})
app.listen(PORT, () => {
    console.log(`server started at port: ${PORT}, Visit The Live Website At: http://127.0.0.1:${PORT}`)
})