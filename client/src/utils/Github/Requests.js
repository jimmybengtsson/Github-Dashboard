import axios from 'axios';

let githubURL = 'https://api.github.com/';

export const getUserInfo = (token) => {

    return new Promise((resolve, reject) => {

        axios.get(githubURL + 'user', {
            params: {
                access_token: token

            }
        }).then((response) => {

            resolve(response);

        }).catch((err) => {
                throw new Error(err);
            });
    });
};

export const getOrganizations = (token) => {

        return axios.get(githubURL + 'user/orgs', {
            params: {
                access_token: token

            }
        }).then((response) => {

            return response.data;

        }).catch((err) => {
                throw new Error(err);
            });
};

export const getOrgRepos = (token, url) => {

    return axios.get(url, {
        params: {
            access_token: token

        }
    }).then((response) => {

        return response.data;

    }).catch((err) => {
            throw new Error(err);
        });
};

export const getRepoCommits = (token, url) => {

    let strippedUrl = url.replace(/{.*}/, '');

    return axios.get(strippedUrl, {
        params: {
            access_token: token

        }
    }).then((response) => {

        return response.data;

    }).catch((err) => {
        if (err.status === 409) {
            return [];
        }
            console.log(err.message)
        });
};

export const getPersonalRepos = (token, url) => {

    return axios.get(url, {
        params: {
            access_token: token

        }
    }).then((response) => {

        return response.data;

    }).catch((err) => {
        throw new Error(err);
    });
};