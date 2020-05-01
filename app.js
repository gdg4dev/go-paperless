// necessary variables
const express = require('express')
const app = express()
const hbs = require('hbs')
const path = require('path')
const compression = require('compression')
const viewPath = path.join(__dirname, './templates/views')
const partialsPath = path.join(__dirname, './templates/partials')
const publicPath = path.join(__dirname, './public')
const PORT = process.env.PORT || 3000
const dns = require('dns')
const bodyParser = require('body-parser')
const adminRoutes = require('./routes/admin')
const session = require('express-session')
    // express configuration
app.use(express.urlencoded())
app.use(compression())
app.use(express.json())
app.use(express.static(publicPath))
hbs.registerPartials(partialsPath)
app.set('view engine', 'hbs')
app.set('views', viewPath)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'IU76c86D473Z3df6G9NPMi0KO8J7T8gf6432Q47FU7V',
    resave: false,
    saveUninitialized: false
}))
app.use('/admin', adminRoutes)

app.get('*', (req, res) => {
    console.log(`requested url: ${req.url} from ip: ${req.connection.address().address} ip type is: ${req.connection.address().family}`)
    res.status('404').send()
})

app.listen(PORT, () => {
    console.log(`server started ${PORT}, Visit The Live Website At: http://127.0.0.1:${PORT}`)
})