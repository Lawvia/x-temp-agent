const bodyParser = require('body-parser')
const helmet = require('helmet')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const cookieParser = require('cookie-parser')
const c_main = require('./app/controllers/controller_main')
const configuration = require("./app/module/configuration")
const app_config = require('./app/config/app.json')
// const redis_config = require('./app/config/redis.json')
// const redis = require('redis')
const session = require('express-session')
// let RedisStore = require('connect-redis')(session)
const passport = require("./app/module/passport")
const flash = require('express-flash');
// const pubsub = require('./app/module/message_queue')


// Enable proxy for get secure https
app.enable("trust proxy")

//Views
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit:50000 }))
app.use(express.json({limit: '50mb'}))
app.set('views', path.join(__dirname, 'app/views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname+'/public')))
app.use(express.static(path.join(__dirname+'/logs')))

//custom
// app.use(helmet({ --content security policy problem
//     frameguard: false
// }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
    secret: app_config.secret,
    resave: false,
    unset: 'destroy',
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(flash());

//add middleware for logging access log
require("./app/module/poly_logger").access(app)

app.use('/', c_main)

http.listen(configuration["APP_PORT"], () => console.log('Example app listening on port ' + configuration["APP_PORT"]))