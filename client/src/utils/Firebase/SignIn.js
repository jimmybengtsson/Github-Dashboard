import { auth } from './Initialize';
import * as firebase from 'firebase';

let provider = new firebase.auth.GithubAuthProvider();

provider.addScope('repo');

export const GithubAuth = () => {

    return new Promise((resolve, reject) => {
        auth.signInWithPopup(provider).then((result) => {

            let user = {
                githubToken: result.credential.accessToken,
                info: result.user,
            };
            console.log(user.githubToken);
            console.log(user.info);

            localStorage.setItem('userData', JSON.stringify(user));
            resolve(user);

        }).catch(function(error) {
            reject(error)
        });
    });
};

export const SignOut = () => {

    return new Promise((resolve, reject) => {

        auth.signOut()
            .then(() => {

                localStorage.removeItem('userData');
                resolve();
            })
            .catch(function(error) {
            reject(error)
        });
    });
};

