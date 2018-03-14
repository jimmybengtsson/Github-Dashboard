import { auth } from './Initialize';
import * as firebase from 'firebase';

let provider = new firebase.auth.GithubAuthProvider();

provider.addScope('repo');

export const GithubAuth = () => {

    return firebase.auth().signInWithRedirect(provider);

};

export const SignOut = () => {

    return new Promise((resolve, reject) => {

        auth.signOut()
            .then(() => {

                localStorage.removeItem('userData');
                resolve();
            })
            .catch((err) => {
                throw new Error(err);
            });
    });
};

export const fetchGithubAuth = () => {

    return auth.getRedirectResult().then((result) => {

        if (result.credential) {

            let user = {
                githubToken: result.credential.accessToken,
                info: result.user,
            };
            console.log(user.githubToken);
            console.log(user.info);

            localStorage.setItem('userData', JSON.stringify(user));
            return user;
        }

    })
        .catch((err) => {
            throw new Error(err);
        });

};

