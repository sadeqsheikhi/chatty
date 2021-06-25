const db = require('../Db.js');
const bcrypt = require('bcrypt')

// ================================================================================
//  UPDATE User INFO 
// ================================================================================
/**
 * update attributes that user has changed in DB
 * @param username
 * @param password
 * @returns {Promise<(boolean)[]|(String|*)[]>}
 */
module.exports = async (username, password, profilePic) => {
    
    try {
        // count number of element that changed 
        let check = null

        // find user with id
        const user = await db().sequelize.models.User.findOne({
            where: {
                username: username
            }
        })

        // Don't update if user with new username exist
        if (user.userName != username){
            check = await db().sequelize.models.User.findOne({
                where: {
                    userName: username
                }
            })
        }

        // if username already exists updated with new value
        if (check === null){
            let pass
            if (password) {
                bcrypt.hash(password, 10,  async (err, hash) => {
                    pass = hash
                    await user.update({userName: username, password: pass, profilePic: profilePic})
                })
            } else {
                pass = user.password
                await user.update({userName: username, password: pass, profilePic: profilePic})
            }

            const msg = 'updated user successfully'
            console.log(msg)
            return [true, msg]

        } else {
            // else show already exist message
            const msg = 'user doesn\'t exist to edit'
            console.log(msg)
            return [false, msg]
        }
        
    } catch (err) {
        const msg = 'error in updating user'
        console.log(msg)
        return [false, msg]
    }
}
