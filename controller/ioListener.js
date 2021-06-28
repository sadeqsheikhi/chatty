const user = require('./user')
const chat = require('./chat')

module.exports = function ioListener(io, socket) {
    chat(io, socket)
    user(io, socket)
}