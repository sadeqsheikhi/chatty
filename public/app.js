$(document).ready(function () {

    let message = $('#message')
    let sendMessage = $('#send-message')
    let chatBox = $('.msg_card_body')
    let isTyping = $('#is-typing')
    let logout = $('#logout')
    let password = $('#change-password');
    let passwordRep = $('#change-password-rep');
    let editButton = $('#editButton')
    let editError = $('#edit-errorBox')
    let avatarImg = $('#avatar-img')
    let avatarSelect = $('#avatar-select')
    let editUser = $('#editUser')

    let socket = io.connect()

    // ==========================  setting up uploader for profile photo
    let uploader = new SocketIOFileUpload(socket);
    uploader.listenOnInput(document.getElementById('avatar-select'))
    uploader.addEventListener('complete', (e) => {
        let data = {
            username: editButton.attr('username'),
            password: '',
            profilePic: e.file.name
        }
        socket.emit('updateUser', data)
    })


    // ========================== change passowrd
    editError.hide()
    avatarImg.click(() => {
        avatarSelect.click()
    })
    editButton.click(function () {
        if (password.val() === '' || (passwordRep.val() === '' && password.val() === '')) {
            editUser.modal('hide')

        } else if (password.val().length < 8) {
            editError.show().text("password should be 8 chars or more")

        } else if (password.val() !== passwordRep.val()) {
            editError.show().text("password and password repeat don't match")

        } else {
            editError.hide()

            let data = {
                username: editButton.attr('username'),
                password: password.val(),
                profilePic: ''
            }
            socket.emit('updateUser', data)
        }
    })

    // ==========================  listening for user update response
    socket.on('updateUserRes', data => {
        let notif = document.createElement('div')
        notif.classList.add('text-center', 'notification', 'show')
        if (data[0]) {
            notif.classList.add('alert-success')
            avatarImg.prop('src', 'uploads/' + data[2])
        } else {
            notif.classList.add('alert-warning')
        }

        notif.innerHTML = `${data[1]}`
        $('body').prepend(notif)

        // remove notification
        setTimeout(() => {
            notif.remove()
        }, 3000)
    })

    // ================================   logout
    logout.click(function () {
        window.location.replace('/logout')
    })


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