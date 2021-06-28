const db = require('./../models/Db')()

module.exports = (io, socket) => {

    // listen on logging in
    socket.on('login', async (data) => {
        let res = await db.sequelize.models.User.login(data.username, data.password)
        if (res[1].id) {
            socket.handshake.session.user = res[1]
            socket.handshake.session.save()
        }
        socket.emit('loginRes', res)
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
}
