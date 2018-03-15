let axios = require('axios');
let Notification = require('./Notification');

exports.handlePost = (req, res, admin) => {

    if(req.get('X-GitHub-Event') !== 'ping') {

        let topic = req.get('X-GitHub-Event');
        let topicId = req.body.repository.id;

        let ref = admin.database().ref('users');

        ref.once('value').then((snapshot) => {

            snapshot.forEach((i) => {

                if(i.child('githubWebhooks').child(topicId.toString()).exists()) {

                    if(i.child('philipsHueUrl').exists()) {

                        console.log('Sent a Hue-notifications to ' + i.child('githubName').val() + ' from Github!');
                        Notification.sendToHue(i.child('philipsHueUrl').val());
                    }
                }
            });

        });
        res.end();
    } else {
        console.log('Webhook-ping');
        res.end();
    }
};
