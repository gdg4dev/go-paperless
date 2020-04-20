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

// express configuration
app.use(express.urlencoded())
app.use(compression())
app.use(express.json())
app.use(express.static(publicPath))
hbs.registerPartials(partialsPath)
app.set('view engine', 'hbs')
app.set('views', viewPath)


app.get('/admin', (req, res) => {
    res.render('adminLogin')
})

app.get('*', (req, res) => {
    res.status('404').send()
})

app.listen(PORT, () => {
    console.log('Server started at port: ' + PORT)
})