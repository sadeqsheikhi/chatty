const {DataTypes, Model} = require('sequelize')
const bcrypt = require('bcrypt')

// ==================================================================================
// USER CLASS WITH METHODS
// ==================================================================================
exports.User = class User extends Model {

    // login with correct username and password
    static async login(username, password) {
        const UserAuthenticator = require("./userAuth");
        return await UserAuthenticator.login(username, password)
    }

    // add user
    static async add(args) {
        const createUser = require('./add')
        return await createUser(args.username, args.password)
    }

    // update User
    static async update(args) {
        const updateUsr = require('./update')
        return await updateUsr(args.username, args.password, args.profilePic)
    }

    // // get user info
    // static async getUsers(username) {
    //     const getter = require('./get')
    //     return await getter(username)
    // }


    // // delete User
    // static async delete(args) {
    //     const deleteUsr = require('./delete')
    //     return await deleteUsr(args.userName)
    // }
    //
    // // show User
    // static async show(args) {
    //     const showUsr = require('./show')
    //     return await showUsr(args.id)
    // }
}


// ==================================================================================
// USER DATA TO INITIALIZE THE CLASS IN DB
// ==================================================================================
exports.userData = {
    attributes: {
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        profilePic: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'user.png'
        }
    },
    options: {
        "modelName": 'User'
    }
}