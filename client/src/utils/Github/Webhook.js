import axios from "axios/index";
import {fetchWebhookId, updateWebhookId, removeWebhookId} from "../Firebase/Database";

let webhookPushUrl = 'https://us-central1-github-dashboard-71efc.cloudfunctions.net/webhook';


export const createWebhook = (token, newArray, oldArray, userId) => {

    return new Promise((resolve, reject) => {

        let arrayToSend = [];

        for (let i = 0; i < newArray.length; i++) {
            for (let key in oldArray) {
                if (oldArray[key].id === newArray[i].id) {

                    let newObject = newArray[i].checked;
                    let oldObject = oldArray[key].checked;

                    if (oldObject.commit !== newObject.commit || oldObject.issue !== newObject.issue || oldObject.release !== newObject.release) {

                        arrayToSend.push(newArray[i]);
                    }

                }
            }
        }

        checkIfExistAndUpdate(arrayToSend, userId, token);

        resolve();

    });
};

let checkIfExistAndUpdate = (arrayToSend, userId, token) => {

    let dbResponse;
    let githubResponse;

    return new Promise((resolve, reject) => {
        for (let i = 0; i < arrayToSend.length; i++) {

            axios({
                method: 'GET',
                url: arrayToSend[i].hook,
                headers: {Authorization: 'token ' + token},

            })
                .then((response) => {

                    if (response.data) {

                        githubResponse = response.data;

                    } else {

                        githubResponse = [];
                    }

                    fetchWebhookId(userId)
                        .then((data) => {

                            if (data.val()) {

                                dbResponse = data.val()

                            } else {

                                dbResponse = [];
                            }
                        })
                        .then(() => {

                            let settingsArray = [];

                            if (arrayToSend[i].checked.commit === true) {
                                settingsArray.push('commit_comment');
                            }
                            if (arrayToSend[i].checked.issue === true) {
                                settingsArray.push('issues');
                            }
                            if (arrayToSend[i].checked.release === true) {
                                settingsArray.push('release');
                            }


                            // Check if webhook exists and delete if no event is selected.
                            if (settingsArray.length <= 0) {
                                if (githubResponse.length > 0 && dbResponse.length > 0) {

                                    for (let dbRes = 0; dbRes < dbResponse.length; dbRes++) {
                                        for (let gitRes = 0; gitRes < githubResponse.length; gitRes++) {

                                            if (dbResponse[dbRes] === githubResponse[gitRes].id) {

                                                console.log('DELETE');
                                                return axios({
                                                    method: 'DELETE',
                                                    url: arrayToSend[i].hook + '/' + githubResponse[gitRes].id,
                                                    headers: {Authorization: 'token ' + token},
                                                })
                                                    .then(() => {

                                                        for (let value in dbResponse) {
                                                            if (dbResponse[value] === githubResponse[gitRes].id){
                                                                dbResponse.splice(value, 1);
                                                                break;
                                                            }
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        reject(error);
                                                    });
                                            }
                                        }
                                    }

                                    resolve();
                                }
                                // If events are selected
                            } else {

                                if (githubResponse.length > 0 && dbResponse.length > 0) {

                                    for (let dbRes = 0; dbRes < dbResponse.length; dbRes++) {
                                        for (let gitRes = 0; gitRes < githubResponse.length; gitRes++) {

                                            if (Number(dbResponse[dbRes]) === Number(githubResponse[gitRes].id)) {

                                                console.log('PATCH');
                                                return axios({
                                                    method: 'PATCH',
                                                    url: arrayToSend[i].hook + '/' + githubResponse[gitRes].id,
                                                    headers: {Authorization: 'token ' + token},
                                                    data: {
                                                        active: true,
                                                        events: settingsArray,
                                                        config: {
                                                            url: webhookPushUrl,
                                                            content_type: 'json',
                                                        }
                                                    }
                                                })
                                                    .catch((error) => {
                                                        reject(error);
                                                    });
                                            }
                                        }
                                    }
                                } else {

                                    console.log('POST');
                                    return axios({
                                        method: 'POST',
                                        url: arrayToSend[i].hook,
                                        headers: {Authorization: 'token ' + token},
                                        data: {
                                            name: 'web',
                                            active: true,
                                            events: settingsArray,
                                            config: {
                                                url: webhookPushUrl,
                                                content_type: 'json',
                                            }
                                        }
                                    })
                                        .then((response) => {
                                            dbResponse.push(response.data.id)
                                        })
                                        .catch((error) => {
                                            reject(error);
                                        });
                                }

                            }
                        });
                })
                .then(() => {

                    setTimeout(() => {
                        updateWebhookId(userId, dbResponse);
                    }, 3000);
                    resolve();

                })
                .catch((err) => {
                    reject(err);

                });

        }
    });

};