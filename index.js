const express = require('express')
const db = require('./models/Db')()
const http = require('http')

// for file upload over socket
const Siofu = require('socketio-file-upload')

const sharedSession = require("express-socket.io-session");
const ioListener = require('./controller/ioListener')

// SETTING UP SESSIONS
const session = require('express-session')({
    // beware to never get this secret key to anyone
    secret: "hyttrqerufyuv324jfgdhf9834", resave: true, saveUninitialized: true
})

// CREATING DATABASE
db.init().catch(res => {
    console.log('database creation' + res)
})

// ============================================================================
// express setup
// ============================================================================
const app = express()
app.set('view engine', 'ejs');
app.use(Siofu.router)
app.use(session)

// static dir
app.use(express.static('public'))


// ========== ROUTING
app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.status(401).redirect('login')
    }
    return res.render('index', {username: req.session.user.userName, profilePic: req.session.user.profilePic})
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

// ========= CREATING SERVER
server = http.createServer(app);
server.listen(3000, () => {
    console.log('listening on port 3000')
})



// ====================================================================
// socket.io setup
// ====================================================================
const io = require('socket.io')(server)

// sharing session between express and socket.io
io.use(sharedSession(session, {
    autoSave: true
}));

io.of('/').use(sharedSession(session, {
    autoSave: true
}));

// ============ WHEN CONNECTION IS MADE
io.on('connection', (socket) => {

    // Listener for uploading files
    let uploader = new Siofu()
    uploader.dir = "public/uploads"
    uploader.listen(socket)

    ioListener(io, socket)
})

