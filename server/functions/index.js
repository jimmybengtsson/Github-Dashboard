let functions = require('firebase-functions');
let admin = require('firebase-admin');

let Webhook = require('./controller/Webhook');

admin.initializeApp(functions.config().firebase);

exports.webhook = functions.https.onRequest((req, res) => {

    return Webhook.handlePost(req, res, admin);

});
