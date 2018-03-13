let functions = require('firebase-functions');
let admin = require('firebase-admin');

let Webhook = require('./controller/Webhook');

admin.initializeApp(functions.config().firebase);

exports.webhook = functions.https.onRequest((req, res) => {
    console.log(req.body);
    console.log(req.query.foo);
    console.log(req.body.text);
    console.log(req.rawBody);

    res.end();
});

exports.notification = functions.https.onRequest((req, res) => {
    console.log(req.body);
    res.end();
});