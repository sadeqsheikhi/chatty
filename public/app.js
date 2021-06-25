$(document).ready(function () {
    let socket = io.connect('http://localhost:3000')

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
    avatarImg.click(function () {
        avatarSelect.click()
    })
    editError.hide()

    editButton.click(function () {
        let profilePic;
        if (password.val() === '' || (passwordRep.val() === '' && password.val() === '')) {
            if (avatarSelect.val()) {
                profilePic = avatarSelect.val().split("\\")
                profilePic = profilePic[profilePic.length - 1].split('.');
                profilePic = profilePic[profilePic.length - 1]
                profilePic = editButton.attr('username') + '.' + profilePic
                let data = {
                    username: editButton.attr('username'),
                    password: '',
                    profilePic: profilePic
                }
                socket.emit('updateUser', data)
            }


        } else if (password.val().length < 8) {
            editError.show().text("password should be 8 chars or more")


        } else if (password.val() !== passwordRep.val()) {
            editError.show().text("password and password repeat don't match")


        } else {
            editError.hide()
            if (avatarSelect.val()) {
                profilePic = avatarSelect.val().split("\\")
                profilePic = profilePic[profilePic.length - 1].split('.');
                profilePic = profilePic[profilePic.length - 1]
                profilePic = editButton.attr('username') + '.' + profilePic
            }
            let data = {
                username: editButton.attr('username'),
                password: password.val(),
                profilePic: profilePic
            }
            socket.emit('updateUser', data)

        }
    })

    logout.click(function () {
        window.location.replace('http://localhost:3000/logout')
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


    // listening for user update
    socket.on('updateUserRes', data => {
        let notif = document.createElement('div')
        notif.classList.add('alert', 'text-center', 'notification', 'show')
        if (data[0]) {
            notif.classList.add('alert-success')
        } else {
            notif.classList.add('alert-warning')
        }
        notif.setAttribute('role', 'alert')
        notif.style.zIndex = '34343'
        notif.innerHTML = `
            ${data[1]}
            `
        $('body').prepend(notif)
        // remove notification
        setTimeout(() => {
            notif.remove()
        }, 3000)

    })


});