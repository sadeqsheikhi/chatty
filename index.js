const express = require('express')
const app = express()
const db = require('./models/Db')
const session = require('express-session')
db().init().catch(res => {
    console.log('database creation' + res)
})

// ==================================================================================
// express setup
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(session({secret:"hyttrqerufyuv324jfgdhf9834", resave: false, saveUninitialized: true}))

app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.status(401).render('login')
    }
    return res.status(200).render('index')
})
app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/login', (req, res) => {
    res.render('login')
})
server = app.listen(3000)

// ==================================================================================
// socket.io
const io = require('socket.io')(server)
io.on('connection', (socket) => {


    // listen on new_message
    socket.on('newMessage', (data) => {
        console.log(data.message)
        //broadcast the new message
        io.sockets.emit('newMessage', {message : data.message, username: data.username});
    })

    // listen on typing
    socket.on('typing', data => {
      socket.broadcast.emit('typing', {username: data.username})
    })

    // listen on creating user
    socket.on('signup', async(data) => {
        let res = await db().sequelize.models.User.add({username: data.username, password: data.password})
        socket.emit('signupRes', res)
    })

    socket.on('login', async(data) => {
        let res = await db().sequelize.models.User.login(data.username, data.password)
        socket.emit('loginRes', res)
    })

})