module.exports = (app, express) => {
    require('dotenv').config()
    console.log('📗 Loaded Environment Variables');
    require('./private/admin-json-generator')
    console.log('📗 Generated Admin Credentials');
    const hbs = require('hbs')
    const path = require('path')
    const compression = require('compression')
    const viewPath = path.join(__dirname, './templates/views')
    const partialsPath = path.join(__dirname, './templates/partials')
    const publicPath = path.join(__dirname, './public')
    const session = require('express-session')
    const cookieParser = require('cookie-parser')
    require('./db/db-config')
    console.log('📗 Connected to Database');
    require('./routes/helpers/tokens/isAuth')
    console.log('📗 JWT(R) Configuration Completed !');
    require('./routes/helpers/brute')(app)
    console.log('📗 Brute-Force Prevention Applied');
    app.use(express.json());
    app.use(express.urlencoded())
    console.log('📗 API configured');
    app.use(compression())
    console.log('📗 Using gzip Compression');
    app.use(cookieParser())
    console.log('📗 Cookies Middleware Loaded');
    app.use(express.static(publicPath))
    hbs.registerPartials(partialsPath)
    app.set('view engine', 'hbs')
    app.set('views', viewPath)
    console.log('📗 Handlebars loaded');
    app.use(session({
        secret: `${process.env.GP_EXPRESS_SESSION_SECRET}`,
        resave: false,
        saveUninitialized: false
    }))
    console.log('📗 Session Settings Apllied');
}