import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBHfXNrBrTHlmQQLLTYkyzL9Ta-j9yYmrw",
    authDomain: "github-dashboard-71efc.firebaseapp.com",
    databaseURL: "https://github-dashboard-71efc.firebaseio.com",
    projectId: "github-dashboard-71efc",
    storageBucket: "github-dashboard-71efc.appspot.com",
    messagingSenderId: "295356888724"
};

console.log(config);

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const auth = firebase.auth();

export {
    auth,
};