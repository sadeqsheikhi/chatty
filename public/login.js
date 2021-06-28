(function () {
    let socket = io.connect()

    const username = $('#username')
    const password = $('#password')
    const loginButton = $('#login')
    const errorBox = $('#error-box')

    errorBox.hide()
    let allowSignup = true

    loginButton.on('click', () => {

        // check for emptiness
        if (username.val() === '' || password.val() === '') {
            errorBox.show()
            errorBox.text('No field can be empty')
        }

        // send message to server
        else {
            errorBox.hide()
            if (allowSignup) {
                allowSignup = false
                socket.emit('login', {username: username.val(), password: password.val()})
            }
        }
    })

    socket.on('loginRes', data => {
        if (data[0]) {
            window.location.replace('/')
        } else {
            errorBox.show()
            allowSignup = false
            errorBox.text(data[1].error)
        }
    })
})()