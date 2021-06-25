(function () {
    let socket = io.connect('http://localhost:3000')

    const username = $('#username')
    const password = $('#password')
    const loginButton = $('#login')
    const errorBox = $('#error-box')
    errorBox.hide()
    let allowSignup = true;

    loginButton.on('click', () => {
        // check for emptiness
        if (isEmpty(username) || isEmpty(password)) {
            errorBox.show()
            errorBox.text('No field can be empty')
        }

        // send message to server
        else {
            errorBox.hide()
            if (allowSignup) {
                socket.emit('login', {username: username.val(), password: password.val()})
            }
        }
    })

    socket.on('loginRes', data => {
        if (data[0]) {
            window.location.replace('http://localhost:3000')
        } else {
            errorBox.show()
            errorBox.text(data[1].error)
        }
    })
})()

function isEmpty(formEl) {
    return formEl.val() === ''
}