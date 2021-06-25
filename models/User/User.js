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
    //
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
    //
    // // update User
    // static async update(args) {
    //     const updateUsr = require('./update')
    //     return await updateUsr(args.id ,args.fullName, args.userName, args.password, args.userType, args.birthDate, args.phoneNumber)
    // }
    //
    // // get user info
    // static async getUsers(username) {
    //     const getter = require('./get')
    //     return await getter(username)
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
    },
    options: {
        "modelName": 'User'
    }
}