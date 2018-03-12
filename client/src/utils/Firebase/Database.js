import { database } from './Initialize';

export const updateWebhookSettings = (userId, data) => {

    console.log(userId);
    console.log(data);
    return database.ref('users/' + userId + '/githubWebhooks').update({
        [data.id]: data,
    })
        .then((response) => {
            return response;
        })
        .catch((err) => {
            console.log(err);
        });

};

export const fetchWebhookSettings = (userId) => {

    console.log(userId);
    return database.ref('users/' + userId + '/githubWebhooks')
        .once('value', (snapshot) => {
            console.log(snapshot.val());
            return snapshot.val();
        });

};