let axios = require('axios');

exports.sendToHue = (url) => {

    axios.get(url)
        .then((response) => {
            console.log('Sent notification to Hue!');
        })
        .catch((error) => {
            console.log(error);
        });
};
