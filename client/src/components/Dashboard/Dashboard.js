import React, { Component } from 'react';
import './Dashboard.css';
import {getPersonalRepos, getRepoCommits} from "../../utils/Github/Requests";
import CircularProgress from 'material-ui/CircularProgress';
let eventArray;


class Dashboard extends Component {

    constructor(props){
        super(props);

        this.state = {
            githubRepo: '',
            githubData: this.props.state.githubData,
            githubToken: this.props.state.githubToken,
            loaded: true
        };
    }

    setRepoUrl(url) {
        this.setState({
            repoUrl: url,
        });
    }

   /* componentDidMount() {

        eventArray = [];
        if (this.props.state.github) {

            getPersonalRepos(this.props.state.githubToken, 'https://api.github.com/user/repos')
                .then((response) => {

                    response.forEach((i) => {
                        getRepoCommits(this.props.state.githubToken, i.commits_url)
                            .then((responseCommits) => {
                                console.log(responseCommits);
                                if (responseCommits !== null && Array.isArray(responseCommits) && responseCommits.length >= 0) {

                                    for (let j = 0; j < responseCommits.length; j++) {

                                        if(j === null) {
                                            return;
                                        } else {
                                            eventArray.push({event: 'Commit', date: j.commit.committer.date});
                                        }
                                    }

                                }

                                getRepoCommits(this.props.state.githubToken, i.issues_url)
                                    .then((responseIssues) => {
                                        console.log(responseIssues);
                                        if (Array.isArray(responseIssues) && responseIssues.length >= 0) {


                                            for (let j = 0; j < responseIssues.length; j++) {

                                                eventArray.push({event: 'Issue', date: j.created_at});
                                            }

                                        }

                                        getRepoCommits(this.props.state.githubToken, i.releases_url)
                                            .then((responseReleases) => {

                                                console.log(responseReleases);
                                                if (Array.isArray(responseReleases) && responseReleases.length >= 0) {
                                                for (let j = 0; j < responseReleases.length; j++) {


                                                        eventArray.push({event: 'Release', date: j.published_at});
                                                    }

                                                }
                                            })

                                    })
                            })
                    })
                })
                .then(() => {
                    console.log(eventArray);
                    this.setState({
                        loaded: true,
                    });

                })
        }
    }*/

    render() {

        const githubLoggedIn = this.props.state.github;

        return (
            <div className="View-body">
                {githubLoggedIn ?  (
                    <div>
                        {this.state.loaded ?  (
                            <p>Dashboard</p>
                        ) : (
                            <CircularProgress style={style.spinner}/>
                        )}
                    </div>
                            ) : (
                    <div className="message">
                        <p>You have to sign in to Github to view this.</p>
                        <p>Please go to settings!</p>
                    </div>
                )}
            </div>
        );
    }
}

export default Dashboard;

const style = {
    spinner: {

        margin: 'auto',
    }
};