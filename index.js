const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')



//CONFG Express--
const server = express()
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
//CONFIG Cors
//let i = 1
let ip = ''
server.use('/', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    server.use(cors({ origin: 'https.galosburguer.vercel.app' }))
    //console.log(`Acessou pela ${i++}ª vez.`)
    //console.log(`Host: ${req.headers.host}`)
    //console.log(req.headers.referer)
    //ip = req.headers.host
    next()
})
//---------
server.use('/uploads', express.static('./uploads'))
//-------------------------------------------------------------------------

//Mongoose
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB is conection"))
    .catch(err => console.log("MongoDB fail"))
//-------------------------------------------------------

//Outras--
server.use(require('./routes'))

server.listen(process.env.PORT || 8080 )