const express = require('express')
const app = express()
const db = require('./models/Db')
const http = require('http')
const session = require('express-session')({
    secret: "hyttrqerufyuv324jfgdhf9834", resave: true, saveUninitialized: true
})
sharedsession = require("express-socket.io-session");

db().init().catch(res => {
    console.log('database creation' + res)
})

// storing currently active users
activeUsers = []

// =====================================================================================================================
// express setup
// =====================================================================================================================
app.set('view engine', 'ejs')
app.use(express.static('public'))

// beware to never get this secret key to anyone
app.use(session)

app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.status(401).redirect('login')
    }
    return res.status(200).render('index')
})
app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/login', (req, res) => {
    console.log(req.session)
    if (req.session.user)
        res.redirect('/')
    else
        res.render('login')
})

app.get('/logout', (req, res) => {
    console.log('logging out')
    console.log(req.session.id)
    if (req.session.user)
        delete req.session.user
    res.redirect('login')
})
server = http.createServer(app);
server.listen(3000, () => {
    console.log('listening on port 3000')
})
// =====================================================================================================================
// socket.io setup
// =====================================================================================================================
const io = require('socket.io')(server)

// saving shared-session on every change
io.use(sharedsession(session, {
    autoSave: true
}));

io.of('/').use(sharedsession(session, {
    autoSave: true
}));

// when a connection is created
io.on('connection', (socket) => {

    socket.on('login', async (data) => {
        let res = await db().sequelize.models.User.login(data.username, data.password)
        if (res[1].id) {
            socket.handshake.session.user = res[1]
            socket.handshake.session.save()
            console.log(socket.handshake.session.id)
        }
        socket.emit('loginRes',res)
    })

    // listen on new_message
    socket.on('newMessage', (data) => {
        console.log(data.message)
        //broadcast the new message
        io.sockets.emit('newMessage', {message: data.message, username: data.username});
    })

    // listen on typing
    socket.on('typing', data => {
        socket.broadcast.emit('typing', {username: data.username})
    })

    // listen on creating user
    socket.on('signup', async (data) => {
        let res = await db().sequelize.models.User.add({username: data.username, password: data.password})
        socket.emit('signupRes', res)
    })

})