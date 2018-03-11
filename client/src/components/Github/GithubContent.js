import React, { Component } from 'react';
import {getOrgRepos, getRepoCommits} from "../../utils/Github/Requests";
import CircularProgress from 'material-ui/CircularProgress';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import './Github.css';
import {cyan500} from "material-ui/styles/colors";
import GithubEvent from "./GithubEvent";

let tempEvents;

class GithubContent extends Component {

    constructor(props){
        super(props);

        console.log(props);
        this.state = {
            isLoaded: false,
        };

    }

    getRepoInformation(commitsUrl, issuesUrl, releasesUrl) {

        tempEvents = [];
        let tempValue = 0;

        getRepoCommits(this.props.state.githubToken, commitsUrl)
            .then((response) => {

                response.forEach((i) => {

                    tempValue = tempValue + 1;
                    tempEvents.push(<GithubEvent
                        value={tempValue}
                        key={i.id}
                        data={i}
                        author={i.committer.login}
                        avatar={i.committer.avatar_url}
                        event={'Commit'}
                        date={i.commit.committer.date}
                        message={i.commit.message}
                        url={i.html_url}
                    />);
                });
            })
            .then(() => {
                getRepoCommits(this.props.state.githubToken, issuesUrl).then((response) => {

                    response.forEach((i) => {

                        tempValue = tempValue + 1;
                        tempEvents.push(<GithubEvent
                            value={tempValue}
                            key={i.id}
                            data={i}
                            author={i.user.login}
                            avatar={i.user.avatar_url}
                            event={'Issue'}
                            date={i.created_at}
                            message={i.title}
                            url={i.html_url}
                        />);
                    });
                })
                    .then(() => {
                        getRepoCommits(this.props.state.githubToken, releasesUrl).then((response) => {

                            response.forEach((i) => {

                                tempValue = tempValue + 1;
                                tempEvents.push(<GithubEvent
                                    value={tempValue}
                                    key={i.id}
                                    data={i}
                                    author={i.author.login}
                                    avatar={i.author.avatar_url}
                                    event={'Release'}
                                    date={i.created_at}
                                    message={i.tag_name + ': ' + i.name}
                                    url={i.html_url}
                                />);
                            });
                        }).then(() => {
                            console.log(tempEvents);
                            tempEvents.sort(function(a, b){
                                let keyA = new Date(a.props.date);
                                let keyB = new Date(b.props.date);
                                // Compare the 2 dates
                                if(keyA < keyB) return 1;
                                if(keyA > keyB) return -1;
                                return 0;
                            });
                        })
                            .then(() => {
                                this.setState({
                                    isLoaded: true,
                                });
                            })
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    componentDidMount() {
        this.getRepoInformation(this.props.state.repoContent.commits_url, this.props.state.repoContent.issues_url, this.props.state.repoContent.releases_url);
    }

    componentWillReceiveProps(nextProps) {
        this.getRepoInformation(nextProps.state.repoContent.commits_url, nextProps.state.repoContent.issues_url, nextProps.state.repoContent.releases_url);
    }

    render() {

        return (
            <div className="Content-body-temp">
                {this.state.isLoaded ? (
                    <div className="Content">
                        <div className="Content-graph">
                            <p>Graph</p>
                        </div>
                        <div className="Content-events">
                            <Divider />
                            <Subheader>Events:</Subheader>
                            <List >
                                {tempEvents}
                            </List>
                        </div>
                    </div>
                ) : (
                    <CircularProgress style={style.spinner}/>
                )}
            </div>
        );
    }
}

export default GithubContent;

const style = {
    spinner: {

        margin: 'auto',
    }
};