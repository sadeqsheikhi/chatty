const {Sequelize} = require("sequelize");
const {User, userData} = require('./user/User.js')

// ==================================================================================
// SINGLETON CLASS FOR DATABASE
// ==================================================================================
let database;
class Db {
    // ==================================================================================
    // constructs the db and logs if there is error
    constructor() {
        try {
            this.sequelize = new Sequelize({
                dialect: "sqlite",
                storage: "./chatty.sqlite"
            })
        } catch (err) {
            let msg = "Database Creation Error =>" + err.message +':in:'+ __filename
            // for logging in the console
            console.log(msg)
        }
    }

    // ==================================================================================
    // authenticating the db with logging and info handling
    async authenticate() {
        // check if db connection is correct
        try {
            await this.sequelize.authenticate();
            return true
        } catch (error) {
            let msg

            msg = 'database authentication failed'
            return [false, msg]
        }
    }

    // ==================================================================================
    // initializing the database at start of application
    init = async () => {
        let ConnectionValid = this.authenticate();
        if (ConnectionValid) {

            await User.init(userData.attributes, {sequelize: this.sequelize, modelName: userData.options.modelName})

            // syncing db
            await this.sequelize.sync()

            return true
        } else {
            return false
        }
    }
}


// ==================================================================================
// WHAT WE ARE USING THROUGHOUT THE APPLICATION
module.exports = function () {
    if (typeof database !== typeof new Db()) {
        database = new Db()
        return database
    } else {
        return database
    }
}