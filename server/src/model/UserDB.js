'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Start the user db

function startUserDB() {

    console.log('Start user db');

    let db = mongoose.connection;

    db.on('error', (error) => {
        console.log('connection error', error);
    });

    db.once('open', () => {
        console.log('User database connected.');
    });

    process.on('SIGINT', () => {
        db.close(() => {
            console.log('Mongoose disconnected because of app termination.');
            process.exit(0);
        });
    });

    // Connect

    mongoose.Promise = global.Promise;

    return mongoose.connect(process.env.USER_DB_CONNECTION);

}

let UserSchema = new Schema({

    userName: {
        type: String,
        required: true,
        trim: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },

    date: {
        type: Date,
        default: Date.now(),
        required: true,
    },

});

module.exports = mongoose.model('Users', UserSchema);
module.exports.startUserDB = startUserDB;

