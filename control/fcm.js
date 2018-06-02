
const admin = require('firebase-admin');

const serviceAccount = require('../config/serviceKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gofirebaseproject-a69cb.firebaseio.com"
});


module.exports = {
    sendToDevice: function (receiver, title, body){
    const payload = {
        notification: {
            title: title,
            body: body
        },
    };

    admin.messaging().sendToDevice(receiver, payload)
        .then((response) => {
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });

    },
    sendToTopic: function(topic, title, body){
        const payload = {
            notification: {
                title: title,
                body: body
            },
        };

        admin.messaging().sendToTopic(topic, payload)
            .then((response) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });

    }
};
