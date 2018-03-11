import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

import './Github.css';
import GithubMenu from "./GithubMenu";
import GithubRepoList from './GithubRepoList';
import GithubContent from "./GithubContent";

class Github extends Component {

    constructor(props){
        super(props);

        this.state = {
            githubRepo: '',
            githubData: this.props.state.githubData,
            githubToken: this.props.state.githubToken,
        };

        this.setRepoUrl = this.setRepoUrl.bind(this);
        this.setRepoContent = this.setRepoContent.bind(this);

    }

    setRepoUrl(url) {
        this.setState({
            repoUrl: url,
        });
        console.log(this.state);
    }

    setRepoContent(url) {
        this.setState({
            repoContent: url,
        });
        console.log(this.state);
    }

    render() {

        const githubLoggedIn = this.props.state.github;

        return (
            <div className="View-body">
                {githubLoggedIn ?  (
                    <div className="Github-body">
                        <div className="Menu-body">
                            <GithubMenu githubToken={this.state.githubToken} githubData={this.state.githubData} setRepoUrl={this.setRepoUrl}/>
                            {this.state.repoUrl ? (
                                <GithubRepoList state={this.state} githubToken={this.state.githubToken} setRepoContent={this.setRepoContent}/>
                            ) : (
                                <CircularProgress style={style.spinner}/>
                            )}
                        </div>
                        <div className="Content-body">
                            {this.state.repoContent ? (
                                <GithubContent state={this.state} data={this.props.state}/>
                            ) : (
                                <p className="message">Click on repository to view events!</p>
                            )}
                        </div>
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

const style = {
    spinner: {

        margin: 'auto',
    }
};