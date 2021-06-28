const db = require('./../models/Db')()
onlineUsers = []
module.exports = (io, socket) => {

    // listen on logging in
    socket.on('login', async (data) => {
        let res = await db.sequelize.models.User.login(data.username, data.password)
        if (res[1].id) {
            socket.handshake.session.user = res[1]
            socket.handshake.session.save()
        }
        socket.emit('loginRes', res)
        if (res[0]) {
            socket.broadcast.emit('serverMessage', `"${res[1].userName}" Joined The Super Chat`)

            let exists = false
            onlineUsers.forEach(user => {
                if (res[1].userName === user.username) {
                    exists = true
                }
            })
            if (!exists)
                onlineUsers.push({username: res[1].userName, profilePic: res[1].profilePic})
            setTimeout(() => {
                io.emit('onlineUsers', onlineUsers)
            }, 1000)
        }
    })


    // listen on creating user
    socket.on('signup', async (data) => {
        let res = await db.sequelize.models.User.add({username: data.username, password: data.password})
        socket.emit('signupRes', res)
    })


    // listen for changing password
    socket.on('updateUser', async (data) => {
        let res = await db.sequelize.models.User.update(data)
        console.log('updating user', res)
        socket.emit('updateUserRes', res)
    })

    socket.on('reqUserInfo', async (data) => {
        socket.emit('resUserInfo', socket.handshake.session.user)
    })


    socket.on('logout', async (data) => {
        console.log('getting logout message')
        io.emit('serverMessage', `${data.username} left the super chat`)
        for (let i = 0; i < onlineUsers.length; i++) {
            if (onlineUsers[i].username === data.username) {
                onlineUsers.splice(i, 1)
            }
        }
        io.emit('onlineUsers', onlineUsers)
    })
}
