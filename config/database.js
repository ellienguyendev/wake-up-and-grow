// config/database.js
module.exports = {

    'url' : `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0-stpgj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
    'dbName': process.env.DB_NAME
};

// if cloning / forking repo
// Create .env file with:
// USER_NAME = username
// USER_PASSWORD = password
// DB_NAME = database name
