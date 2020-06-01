module.exports = (app)=>{
    const client = require('redis').createClient()
const limiter = require("express-limiter")(app,client);
limiter({
  path: "/core/login/in/*",
  method: "all",
  total: 7,
  expire: 1000 * 60 * 60,
  lookup: 'connection.remoteAddress',
  onRateLimited: (req,res)=>{
    res.status(429).send({
        NEXT: `responseData = ()=>{document.write('too many requests! please retry after hour')}`
                })
},
whitelist: (req) => {return 1} 
});

limiter({
    path: "/core/login/up/*",
    method: "all",
    total: 7,
    expire: 1000 * 60 * 60,
    lookup: 'connection.remoteAddress',
    onRateLimited: (req,res)=>{
        res.status(429).send({
NEXT : `responseData = ()=>{document.write('too many requests! please retry after hour')}`
        })
    } 
});
}