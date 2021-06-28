$(document).ready(function () {

    let messageField = $('#message')
    let sendMessage = $('#send-message')
    let chatBox = $('.msg_card_body')
    let isTyping = $('#is-typing')
    let logout = $('#logout')
    let passwordField = $('#change-password');
    let passwordRep = $('#change-password-rep');
    let editButton = $('#editButton')
    let editError = $('#edit-errorBox')
    let avatarImg = $('#avatar-img')
    let avatarSelect = $('#avatar-select')
    let editUser = $('#editUser')
    let today = new Date()

    let socket = io.connect()
    let username, profilePic
    // getting username and profilePicture of currentUser
    socket.emit('reqUserInfo')

    socket.on('resUserInfo', data => {
        username = data.userName
        profilePic = data.profilePic
    })


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
        if (passwordField.val() === '' || (passwordRep.val() === '' && passwordField.val() === '')) {
            editUser.modal('hide')

        } else if (passwordField.val().length < 8) {
            editError.show().text("password should be 8 chars or more")

        } else if (passwordField.val() !== passwordRep.val()) {
            editError.show().text("password and password repeat don't match")

        } else {
            editError.hide()

            let data = {
                username: editButton.attr('username'),
                password: passwordField.val(),
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
            updateImages(profilePic, data[2])
            profilePic = data[2]
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

    // finds images and replaces them
    function updateImages(oldImage, newImage) {
        let images = document.getElementsByTagName("img")
        images = [...images]
        images.forEach(image => {
            let src = image.getAttribute('src')
            if (src.includes(oldImage)) {
                image.setAttribute('src', `uploads/${newImage}`)
            }
        })
    }

    // ================================   logout
    logout.click(function () {
        socket.emit('logout', {username: username})
        window.location.replace('/logout')
    })


    // ========================== sending message
    sendMessage.click(function () {
        if (messageField.val()) {
            let time = `${today.getHours()}:${today.getMinutes()}`
            socket.emit('newMessage', {
                message: messageField.val(),
                username: username,
                profilePic: profilePic,
                time: time
            })

            message = `
            <div class="d-flex justify-content-end mb-4">
                <div class="msg_cotainer_send">
                    ${messageField.val()}
                    <span class="msg_time_send">${time}, Today</span>
                </div>
                <div class="img_cont_msg">
                    <img src="uploads/${profilePic}"
                         class="rounded-circle user_img_msg">
                </div>
            </div>
            `
            chatBox.append(message)
        }
        messageField.prop('value', '')
    })

    // ======================== receiving messages
    socket.on('newMessage', data => {
        console.log(data)
        let message =
            `
            <div class="d-flex justify-content-start mb-4 align-items-center">
                <div class="img_cont_msg">
                    <img src="uploads/${data.profilePic}"
                         class="rounded-circle user_img_msg">
                </div>
                <div class="msg_cotainer">
                    <p>
                        ${data.username}:
                    </p>
                   ${data.message}
                    <span class="msg_time">${data.time}, Today</span>
                </div>
            </div>
            `
        chatBox.append(message)
    })

    // ========================= is typing for single person
    messageField.bind('keypress', e => {
        socket.emit('typing', {username: username})
    })

    // ======================== showing the is typing method
    socket.on('typing', data => {
        message = `<i>${data.username}</i> is typing ...`
        isTyping.html(message)
        setTimeout(() => {
            isTyping.html('')
        }, 2000)
    })

    // ======================== on server message
    socket.on('serverMessage', msg => {
        let html = `<p class="text-white-50">${msg}</p>`
        chatBox.append(html)
    })

    // ======================= online user added
    socket.on('onlineUsers', data => {
        let html = ''
        data.forEach(person => {
            html += `
            <li class="active">
                <div class="d-flex bd-highlight">
                    <div class="img_cont">
                        <img src="uploads/${person.profilePic}"
                             class="rounded-circle user_img">
                        <span class="online_icon"></span>
                    </div>
                    <div class="user_info">
                        <span>${person.username}</span>
                        <p>${person.username} is online</p>
                    </div>
                </div>
            </li>
            `
        })
        $('.contacts').html(html)

    })
});

