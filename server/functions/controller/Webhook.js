let axios = require('axios');
let Notification = require('./Notification');

exports.handlePost = (req, res, admin) => {

    let topic = req.get('X-GitHub-Event');
    let topicId = req.body.repository.id;

    admin.database().ref('users').equalTo(topicId.toString())
        .once('value', (snapshot) => {

            console.log(snapshot);
            snapshot.forEach(function(childSnapshot) {
                if (snapshot.val().philipsHueUrl.length > 1) {

                    console.log(childSnapshot);
                    Notification.sendToHue(childSnapshot.val().philipsHueUrl)
                }
            });
    });

    res.end();
};

exports.create = () => {

};