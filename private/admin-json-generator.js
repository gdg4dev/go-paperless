const fs = require('fs')
const path = require('path')
let jsonData = `{"username":"${process.env.GP_ADMIN_USERNAME}","password":"${process.env.GP_ADMIN_PASSWORD}"}`
fs.writeFileSync(path.join(__dirname + '/admin_login.json'), jsonData, () => {

})