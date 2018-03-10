import React, { Component } from 'react';
import {getOrganizations} from "../../utils/Github/Requests";
import CircularProgress from 'material-ui/CircularProgress';

import './Github.css';
import GithubMenu from "./GithubMenu";
import GithubRepoList from './GithubRepoList';

class Github extends Component {

    constructor(props){
        super(props);

        this.state = {
            githubRepo: '',
            githubData: this.props.state.githubData,
            githubToken: this.props.state.githubToken,
        };

        this.setRepoUrl = this.setRepoUrl.bind(this);

    }

    setRepoUrl(url) {
        this.setState({
            repoUrl: url,
        });
        console.log(this.state);
    }

    render() {

        const githubLoggedIn = this.props.state.github;

        return (
            <div className="View-body">
                {githubLoggedIn ?  (
                    <div className="Menu-body">
                        <GithubMenu githubToken={this.state.githubToken} githubData={this.state.githubData} setRepoUrl={this.setRepoUrl}/>
                        {this.state.repoUrl ? (
                            <GithubRepoList state={this.state} githubToken={this.state.githubToken}/>
                        ) : (
                            <CircularProgress />
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

export default Github;

/* getUsersOrgs() {

    if (!this.state.user) {
        return <div className="message">
            <p>You have to sign in to Github to view this.</p>
            <p>Please go to settings!</p>
        </div>;
    } else {

        getOrganizations(this.state.user.githubToken)
            .then((response) => {
                console.log(response.data);
                return <GithubRepoList/>
            })
            .catch((err) => {
                console.log(err);
            })
    }
}*/