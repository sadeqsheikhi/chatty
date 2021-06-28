(function () {
    let socket = io.connect()

    const username = $('#username')
    const password = $('#password')
    const passwordRep = $('#password-repeat')
    const signupButton = $('#signup')
    const errorBox = $('#error-box')

    let allowSignup = true; // preventing multiple signups
    errorBox.hide()

    signupButton.on('click', () => {
        // check for emptiness
        if (username.val() === '' || passwordRep.val() === '' || passwordRep.val() === '') {
            errorBox.show()
            errorBox.text('No field can be empty')
        }

        // check for password length
        else if (password.val().length < 8) {
            errorBox.show()
            errorBox.text('Password should be 8 chars or more')
        }

        // check for password matching
        else if (passwordRep.val() !== password.val()) {
            errorBox.show()
            errorBox.text('Password And Password Repeat Do Not Match')
        }

        // send message to server
        else {
            errorBox.hide()
            if (allowSignup) {
                socket.emit('signup', {username: username.val(), password: password.val()})
                allowSignup = false
            }
        }

    })


    // ===================== listening for signup response
    socket.on('signupRes', data => {
        if (data[0]) {
            $('body').prepend(
                `<div class="text-center alert-success notification show" role="alert">
                    ${data[1]}
                </div>`
            )
            setTimeout(() => { window.location.replace('/login') }, 400)

        } else {
            errorBox.show()
            allowSignup = true
            errorBox.text(data[1])
        }
    })
})()