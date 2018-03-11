import { auth } from './Initialize';
import * as firebase from 'firebase';

let provider = new firebase.auth.GithubAuthProvider();

provider.addScope('repo');

export const GithubAuth = () => {

        return auth.signInWithPopup(provider).then((result) => {

            let user = {
                githubToken: result.credential.accessToken,
                info: result.user,
            };
            console.log(user.githubToken);
            console.log(user.info);

            localStorage.setItem('userData', JSON.stringify(user));
            return user;

        }).catch(function(error) {
            console.log(error);
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

