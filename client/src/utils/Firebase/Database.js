import { database } from './Initialize';

export const updateWebhookSettings = (userId, data) => {

    return database.ref('users/' + userId + '/githubWebhooks').update({
        [data.id]: data,
    })
        .then((response) => {
            return response;
        })
        .catch((err) => {
            throw new Error(err);
        });

};

export const fetchWebhookSettings = (userId) => {

    return database.ref('users/' + userId + '/githubWebhooks')
        .once('value', (snapshot) => {
            return snapshot.val();
        })
        .catch((err) => {
            throw new Error(err);
        });

};

export const updateUserData = (userId, data) => {

    return database.ref('users/' + userId).update({

        githubName: data.githubName,
        githubId: data.githubId,
    })
        .catch((err) => {
            throw new Error(err);
        });

};

export const fetchUserData = (userId) => {
    return database.ref('users/' + userId).once('value')
        .then((response) => {
            return response;
        })
        .catch((err) => {
            throw new Error(err);
        });
};

export const updateWebhookId = (userId, data) => {

    return database.ref('users/' + userId).update({

        webhookId: data,
    })
        .catch((err) => {
            throw new Error(err);
        });

};

export const fetchWebhookId = (userId) => {
    return database.ref('users/' + userId + '/webhookId').once('value')
        .then((response) => {
            return response;
        })
        .catch((err) => {
            throw new Error(err);
        });
};

export const createWebhookIdArray = (userId, data) => {

    return database.ref('users/' + userId).update({

        webhookId: data
    })
        .catch((err) => {
            throw new Error(err);
        });
};

export const handlePhilipsHueUrl = (userId, data) => {

    return database.ref('users/' + userId).update({

        philipsHueUrl: data
    })
        .catch((err) => {
            throw new Error(err);
        });

};