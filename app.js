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
    // express configuration
app.use(express.urlencoded())
app.use(compression())
app.use(express.json())
app.use(express.static(publicPath))
hbs.registerPartials(partialsPath)
app.set('view engine', 'hbs')
app.set('views', viewPath)


app.get('/admin', (req, res) => {
    console.log('requested url: ' + req.url + ' from ip: ' + req.connection.address().address + ' ip type is: ' + req.connection.address().family)
    res.render('adminLogin')
    console.log(dns.lookup(req.connection.remoteAddress, (e, a, f) => {
        console.log(a)
    }))
})

app.get('*', (req, res) => {
    console.log(`requested url: ${req.url} from ip: ${req.connection.address().address} ip type is: ${req.connection.address().family}`)
    res.status('404').send()
})

app.listen(PORT, () => {
    console.log(`server started ${PORT}, Visit The Live Website At: http://127.0.0.1:${PORT}`)
})