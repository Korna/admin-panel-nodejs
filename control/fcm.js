
const admin = require('firebase-admin');

const serviceAccount = require('../config/serviceKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gofirebaseproject-a69cb.firebaseio.com"
});


function sendToDevice(receiver, title, body){
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

}