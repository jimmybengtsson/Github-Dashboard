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

        }).catch((error) => {
            reject(error);
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

        }).catch((error) => {
            console.log(error);
        });
};

export const getOrgRepos = (token, url) => {

    return axios.get(url, {
        params: {
            access_token: token

        }
    }).then((response) => {

        return response.data;

    }).catch((error) => {
        console.log(error);
    });
};

export const getRepoCommits = (token, url) => {

    let strippedUrl = url.replace(/{.*}/, '');

    return axios.get(strippedUrl, {
        params: {
            access_token: token

        }
    }).then((response) => {

        console.log(response);
        return response.data;

    }).catch((error) => {
        console.log(error);
    });
};