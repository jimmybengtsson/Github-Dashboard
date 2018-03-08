import * as firebase from "firebase";

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

let provider = new firebase.auth.GithubAuthProvider();

provider.addScope('repo');

export const GithubAuth = () => {

    firebase.auth().signInWithPopup(provider).then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        let token = result.credential.accessToken;
        console.log(token);
        // The signed-in user info.
        let user = result.user;
        console.log(user);
        // ...
    }).catch(function(error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        // The email of the user's account used.
        let email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        let credential = error.credential;
    });
};
