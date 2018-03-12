import React, { Component } from 'react';
import './Settings.css';
import CircularProgress from 'material-ui/CircularProgress';
import GithubMenu from "../Github/GithubMenu";
import SettingsGithubRepos from "./SettingsGithubRepos";

class SettingsGithub extends Component {

    constructor(props){
        super(props);

        this.state = {


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
        return (
            <div className="Github-settings-body">
                <GithubMenu githubToken={this.props.data.githubToken} githubData={this.props.data.githubData} setRepoUrl={this.setRepoUrl}/>
                {this.state.repoUrl ? (
                    <SettingsGithubRepos repoUrl={this.state.repoUrl} data={this.props.data}/>
                ) : (
                    <CircularProgress style={styles.spinner}/>
                )}
            </div>
        );
    }
}

export default SettingsGithub;

const styles = {
    spinner: {

        margin: 'auto',
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        width: 500,
        height: 450,
        overflowY: 'auto',
    },
};
