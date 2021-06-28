module.exports = (io, socket) => {

    // listen on new_message
    socket.on('newMessage', (data) => {
        //broadcast the new message
        socket.broadcast.emit('newMessage', data);
    })

    // listen on typing
    socket.on('typing', data => {
        socket.broadcast.emit('typing', {username: data.username})
    })
}
