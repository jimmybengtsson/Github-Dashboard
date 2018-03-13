import { database } from './Initialize';

export const updateWebhookSettings = (userId, data) => {

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

    return database.ref('users/' + userId + '/githubWebhooks')
        .once('value', (snapshot) => {
            return snapshot.val();
        });

};

export const updateUserData = (userId, data) => {

    return database.ref('users/' + userId).update({

        githubName: data.githubName,
        githubToken: data.githubToken,
        githubId: data.githubId,
    })
        .catch((err) => {
            console.log(err);
        });

};

export const fetchUserData = (userId) => {
    return database.ref('users/' + userId).once('value')
        .then((response) => {
            return response;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const updateWebhookId = (userId, data) => {

    return database.ref('users/' + userId).update({

        webhookId: data,
    })
        .catch((err) => {
            console.log(err);
        });

};

export const fetchWebhookId = (userId) => {
    return database.ref('users/' + userId + '/webhookId').once('value')
        .then((response) => {
            return response;
        })
        .catch((err) => {
            console.log(err);
        });
};