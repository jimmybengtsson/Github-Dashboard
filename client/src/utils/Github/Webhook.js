import axios from "axios/index";
import {fetchWebhookId, updateWebhookId} from "../Firebase/Database";

let webhookPushUrl = 'https://us-central1-github-dashboard-71efc.cloudfunctions.net/webhook';

export const createWebhook = (token, newArray, oldArray, userId) => {

    return new Promise((resolve, reject) => {

        let arrayToSend = [];

        for (let i = 0; i < newArray.length; i++) {

            for (let key in oldArray) {
                if (oldArray[key].id === newArray[i].id) {

                    let newObject = newArray[i].checked;
                    let oldObject = oldArray[key].checked;

                    console.log(newObject.commit);
                    console.log(oldObject.commit);

                    if(oldObject.commit !== newObject.commit || oldObject.issue !== newObject.issue || oldObject.release !== newObject.release) {

                        arrayToSend.push(newArray[i]);
                    }

                }
            }
        }


        console.log(arrayToSend);
        arrayToSend.forEach((i) => {

            let settingsArray = [];

            if(i.checked.commit === true) {
                settingsArray.push('commit_comment');
            }
            if(i.checked.issue === true) {
                settingsArray.push('issues');
            }
            if(i.checked.release === true) {
                settingsArray.push('release');
            }

            // Check if webhook exists and delete if no event is selected.
            if(settingsArray.length <= 0) {

                axios({
                    method: 'GET',
                    url: i.hook,
                    headers: {Authorization: 'token ' + token},

                })
                    .then((response) => {

                        console.log(response);

                        fetchWebhookId(userId)
                            .then((dbResponse) => {

                                if (dbResponse.val() && dbResponse.val().length <= 1) {
                                    if (response.data && response.data.length <= 1) {

                                        if (dbResponse.val()[0] === response.data[0]) {
                                        axios({
                                            method: 'DELETE',
                                            url: i.hook + '/' + response.data[0],
                                            headers: {Authorization: 'token ' + token},

                                        })
                                            .then((response) => {

                                                console.log(response);
                                                resolve(response);

                                            })
                                            .catch((error) => {
                                                console.log(error);
                                                reject(error);
                                            });
                                    }
                                } else {
                                    dbResponse.val().foreach((i) => {
                                        response.data.foreach((j) => {

                                            if (i === j.id) {
                                                axios({
                                                    method: 'DELETE',
                                                    url: i.hook + '/' + j.id,
                                                    headers: {Authorization: 'token ' + token},

                                                })
                                                    .then((response) => {

                                                        console.log(response);
                                                        resolve(response);

                                                    })
                                                    .catch((error) => {
                                                        console.log(error);
                                                        reject(error);
                                                    });
                                            }
                                        });
                                    });
                                }
                            } else {
                                    resolve();
                                }
                    })

                    })
                    .catch((error) => {
                        reject(error);
                    });

                // If events are selected
            } else {

                // Get hooks for url to check if exists.
                axios({
                    method: 'GET',
                    url: i.hook,
                    headers: {Authorization: 'token ' + token},

                })
                    .then((response) => {


                    })
                    .catch((error) => {
                        reject(error);
                    });

            }

        });
    });
};

/*                        if (!response.data) {
                            response.data = []
                        }

                        fetchWebhookId(userId)
                            .then((dbResponse) => {

                                let tempDBResponse = dbResponse.val();

                                if (Array.isArray(tempDBResponse) === false) {
                                    return axios({
                                        method: 'POST',
                                        url: i.hook,
                                        headers: {Authorization: 'token ' + token},
                                        data: {
                                            name: 'web',
                                            active: true,
                                            events: settingsArray,
                                            config: {
                                                url: webhookPushUrl,
                                                content_type: 'json',
                                            } }
                                    })
                                        .then((response) => {

                                            tempDBResponse = [];

                                            tempDBResponse.push(response.data.id);

                                            updateWebhookId(userId, tempDBResponse)
                                                .then((response) => {
                                                    resolve(response);
                                                });

                                        })
                                        .catch((error) => {
                                            reject(error);
                                        });
                                } else if (tempDBResponse.length === 1) {

                                    if (response.data.length === 1) {

                                        console.log(tempDBResponse);
                                        console.log(response.data);

                                        if (tempDBResponse[0] === response.data.id) {

                                            axios({
                                                method: 'PATCH',
                                                url: i.hook + '/' + response.data.id,
                                                headers: {Authorization: 'token ' + token},
                                                data: {
                                                    name: 'web',
                                                    active: true,
                                                    events: settingsArray,
                                                    config: {
                                                        url: webhookPushUrl,
                                                        content_type: 'json',
                                                    } }
                                            })
                                                .then((response) => {

                                                    console.log(response);
                                                    resolve(response);

                                                })
                                                .catch((error) => {
                                                    reject(error);
                                                });
                                        } else {
                                            return axios({
                                                method: 'POST',
                                                url: i.hook,
                                                headers: {Authorization: 'token ' + token},
                                                data: {
                                                    name: 'web',
                                                    active: true,
                                                    events: settingsArray,
                                                    config: {
                                                        url: webhookPushUrl,
                                                        content_type: 'json',
                                                    } }
                                            })
                                                .then((response) => {

                                                    if (Array.isArray(tempDBResponse) === false) {
                                                        tempDBResponse = [];
                                                    }
                                                    tempDBResponse.push(response.data.id);

                                                    updateWebhookId(userId, tempDBResponse)
                                                        .then((response) => {
                                                            resolve(response);
                                                        });

                                                })
                                                .catch((error) => {
                                                    reject(error);
                                                });
                                        }
                                    } else {

                                        if (response.data && response.data.length <= 1) {

                                            if (tempDBResponse[0] === response.data.id) {

                                                axios({
                                                    method: 'PATCH',
                                                    url: i.hook + '/' + response.data.id,
                                                    headers: {Authorization: 'token ' + token},
                                                    data: {
                                                        name: 'web',
                                                        active: true,
                                                        events: settingsArray,
                                                        config: {
                                                            url: webhookPushUrl,
                                                            content_type: 'json',
                                                        } }
                                                })
                                                    .then((response) => {

                                                        console.log(response);
                                                        resolve(response);

                                                    })
                                                    .catch((error) => {
                                                        reject(error);
                                                    });
                                            } else {
                                                return axios({
                                                    method: 'POST',
                                                    url: i.hook,
                                                    headers: {Authorization: 'token ' + token},
                                                    data: {
                                                        name: 'web',
                                                        active: true,
                                                        events: settingsArray,
                                                        config: {
                                                            url: webhookPushUrl,
                                                            content_type: 'json',
                                                        } }
                                                })
                                                    .then((response) => {

                                                        if (Array.isArray(tempDBResponse) === false) {
                                                            tempDBResponse = [];
                                                        }
                                                        tempDBResponse.push(response.data.id);

                                                        updateWebhookId(userId, tempDBResponse)
                                                            .then((response) => {
                                                                resolve(response);
                                                            });

                                                    })
                                                    .catch((error) => {
                                                        reject(error);
                                                    });
                                            }
                                        } else {


                                            response.data.foreach((j) => {

                                                if (tempDBResponse[0] === j.id) {

                                                    axios({
                                                        method: 'PATCH',
                                                        url: i.hook + '/' + j.id,
                                                        headers: {Authorization: 'token ' + token},
                                                        data: {
                                                            name: 'web',
                                                            active: true,
                                                            events: settingsArray,
                                                            config: {
                                                                url: webhookPushUrl,
                                                                content_type: 'json',
                                                            } }
                                                    })
                                                        .then((response) => {

                                                            console.log(response);
                                                            resolve(response);

                                                        })
                                                        .catch((error) => {
                                                            reject(error);
                                                        });
                                                } else {
                                                    return axios({
                                                        method: 'POST',
                                                        url: i.hook,
                                                        headers: {Authorization: 'token ' + token},
                                                        data: {
                                                            name: 'web',
                                                            active: true,
                                                            events: settingsArray,
                                                            config: {
                                                                url: webhookPushUrl,
                                                                content_type: 'json',
                                                            } }
                                                    })
                                                        .then((response) => {

                                                            if (Array.isArray(tempDBResponse) === false) {
                                                                tempDBResponse = [];
                                                            }
                                                            tempDBResponse.push(response.data.id);

                                                            updateWebhookId(userId, tempDBResponse)
                                                                .then((response) => {
                                                                    resolve(response);
                                                                });

                                                        })
                                                        .catch((error) => {
                                                            reject(error);
                                                        });
                                                }
                                            });
                                        }
                                    }

                                } else {

                                    console.log(tempDBResponse);

                                    tempDBResponse.foreach((i) => {
                                        response.data.foreach((j) => {

                                            if (i === j.id) {

                                                axios({
                                                    method: 'PATCH',
                                                    url: i.hook + '/' + j.id,
                                                    headers: {Authorization: 'token ' + token},
                                                    data: {
                                                        name: 'web',
                                                        active: true,
                                                        events: settingsArray,
                                                        config: {
                                                            url: webhookPushUrl,
                                                            content_type: 'json',
                                                        } }
                                                })
                                                    .then((response) => {

                                                        console.log(response);
                                                        resolve(response);

                                                    })
                                                    .catch((error) => {
                                                        reject(error);
                                                    });
                                            } else {
                                                return axios({
                                                    method: 'POST',
                                                    url: i.hook,
                                                    headers: {Authorization: 'token ' + token},
                                                    data: {
                                                        name: 'web',
                                                        active: true,
                                                        events: settingsArray,
                                                        config: {
                                                            url: webhookPushUrl,
                                                            content_type: 'json',
                                                        } }
                                                })
                                                    .then((response) => {

                                                        if (Array.isArray(tempDBResponse) === false) {
                                                            tempDBResponse = [];
                                                        }
                                                        tempDBResponse.push(response.data.id);

                                                        updateWebhookId(userId, tempDBResponse)
                                                            .then((response) => {
                                                                resolve(response);
                                                            });

                                                    })
                                                    .catch((error) => {
                                                        reject(error);
                                                    });
                                            }
                                        });
                                    });
                                }

                            })*/