const bcrypt = require('bcrypt');
const db = require('../Db.js');

// ================================================================================
// creates the New User
// ================================================================================
/**
 * creates a new user with given args and add it to DB
 * @param username
 * @param password
 */
module.exports = async (username, password,) => {
    let newUser
    try {
        // check if user exists
        newUser = await db().sequelize.models.User.findOne({
            where: {
                userName: username
            }
        })

        if (newUser === null) {
            bcrypt.hash(password, 10, async (err, hash) => {
                await db().sequelize.models.User.create({userName: username , password: hash })
                    .then(result => {
                        console.log(result)
                    });
            })
            const msg = `user created successfully`
            console.log(msg)
            return [true, msg]

        } else {
            const msg = `user already exists`
            console.log(msg)
            return [false, msg]
        }

    } catch (err) {
        const msg = `error in creating user`
        console.log(msg)
        return [false, msg]
    }

}
