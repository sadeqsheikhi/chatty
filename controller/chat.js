module.exports = (io, socket) => {

    // listen on new_message
    socket.on('newMessage', (data) => {
        //broadcast the new message
        io.sockets.emit('newMessage', {message: data.message, username: data.username});
    })

    // listen on typing
    socket.on('typing', data => {
        socket.broadcast.emit('typing', {username: data.username})
    })
}
