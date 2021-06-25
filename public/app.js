$(document).ready(function () {
    let socket = io.connect('http://localhost:3000')

    let message = $('#message')
    let sendMessage = $('#send-message')
    let chatBox = $('.msg_card_body')
    let isTyping = $('#is-typing')


    sendMessage.click(function () {
        if (message.val())
            socket.emit('newMessage', {message: message.val(), username: 'sadeqsheikhi',})
    })

    socket.on('newMessage', data => {
        console.log(data)
        let message =
            `
            <div class="d-flex justify-content-start mb-4 align-items-center">
                        <div class="img_cont_msg">
                            <img src="img/rozh.jpeg"
                                 class="rounded-circle user_img_msg">
                        </div>
                        <div class="msg_cotainer">
                            <p>
                                ${data.username}:
                            </p>
                           ${data.message}
                            <span class="msg_time">8:40 AM, Today</span>
                        </div>
                    </div>
            `
        chatBox.append(message)
    })


    message.bind('keypress', e => {
        socket.emit('typing', {username: 'samad'})
    })

    socket.on('typing', data => {
        message = `
        <i>${data.username}</i> is typing ...
        `
        isTyping.html(message)
        setTimeout(() => {
            isTyping.html('')
        }, 800)
    })


});