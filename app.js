const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const adminRoutes = require('./routes/admin');
const publicLoginRoutes = require('./routes/login')
const dashboardRoutes = require('./routes/dashboard')
const apiRoutes = require('./routes/apis')
require('./config')(app, express)

app.use('/api',apiRoutes)
app.use('/admin', adminRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/', publicLoginRoutes)
app.get('*', (req, res) => {
    res.status('404').send()
})
app.listen(PORT, () => {
    console.log(`server started at port: ${PORT}, Visit The Live Website At: http://127.0.0.1:${PORT}`)
})