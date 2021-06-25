(function () {
    let socket = io.connect('http://localhost:3000')

    const username = $('#username')
    const password = $('#password')
    const passwordRep = $('#password-repeat')
    const signupButton = $('#signup')
    const errorBox = $('#error-box')
    errorBox.hide()
    let allowSignup = true;

    signupButton.on('click', () => {
        // check for emptiness
        if (isEmpty(username) || isEmpty(password) || isEmpty(passwordRep)) {
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
            }
        }

    })

    socket.on('signupRes', data => {
        if (data[0]) {
            $('body').prepend(
                `
    <div class="alert text-center alert-success show" role="alert" style="position: fixed; top: 3%; left: 50%; transform: translateX(-50%)">
        ${data[1]}
    </div>
                `
            )
            setTimeout(() => {
                window.location.replace('http://localhost:3000/login');
            }, 400)
        } else {
            errorBox.show()
            errorBox.text(data[1])
        }
    })
})()

function isEmpty(formEl) {
    return formEl.val() === ''
}