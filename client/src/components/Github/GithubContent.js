import React, { Component } from 'react';
import {getRepoCommits} from "../../utils/Github/Requests";
import CircularProgress from 'material-ui/CircularProgress';
import {List} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import './Github.css';
import GithubEvent from "./GithubEvent";
import GithubChart from "./GithubChart";

let eventsArray;
let newEventsArray;
let tempArray;
let chartArray;

class GithubContent extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoaded: false,
        };

    }

    // Ugly promise-nesting but need to fetch Github-data synchronously!
    getRepoInformation(commitsUrl, issuesUrl, releasesUrl) {

        eventsArray = [];
        newEventsArray = [];
        tempArray = [];
        chartArray = [];
        let tempValue = 0;

        // Get commits for specific repo
        getRepoCommits(this.props.state.githubToken, commitsUrl)
            .then((response) => {

                response.forEach((i) => {

                    chartArray.push({event: 'Commit', date: i.commit.committer.date});

                    tempValue = tempValue + 1;
                    eventsArray.push(<GithubEvent
                        value={tempValue}
                        key={tempValue}
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
                // Get issues for specific repo
                getRepoCommits(this.props.state.githubToken, issuesUrl).then((response) => {

                    response.forEach((i) => {

                        chartArray.push({event: 'Issue', date: i.created_at});

                        tempValue = tempValue + 1;
                        eventsArray.push(<GithubEvent
                            value={tempValue}
                            key={tempValue}
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
                        // Get releases for specific repo
                        getRepoCommits(this.props.state.githubToken, releasesUrl).then((response) => {

                            response.forEach((i) => {

                                chartArray.push({event: 'Release', date: i.published_at});

                                tempValue = tempValue + 1;
                                eventsArray.push(<GithubEvent
                                    value={tempValue}
                                    key={tempValue}
                                    author={i.author.login}
                                    avatar={i.author.avatar_url}
                                    event={'Release'}
                                    date={i.published_at}
                                    message={i.tag_name + ': ' + i.name}
                                    url={i.html_url}
                                />);
                            });
                        }).then(() => {
                            eventsArray.sort(function(a, b){
                                let keyA = new Date(a.props.date);
                                let keyB = new Date(b.props.date);
                                // Compare the 2 dates
                                if(keyA < keyB) return 1;
                                if(keyA > keyB) return -1;
                                return 0;
                            });
                        })
                            .then(() => {
                                tempArray = eventsArray;

                                let userData = JSON.parse(localStorage.getItem('userData'));

                                tempArray.forEach((i) => {

                                    let newDate = new Date(i.props.date).getTime();

                                    if(newDate > userData.info.lastLoginAt) {

                                        newEventsArray.push(i);
                                        eventsArray.splice(i, 1);
                                    }
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
                throw new Error(err);
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
                            <p style={{fontSize: '150%', marginBottom: '20px', color: '#505050'}}>{this.props.state.repoContent.name}</p>
                           <GithubChart data={chartArray}/>
                        </div>
                        {newEventsArray.length <= 0 ? (
                            <div className="Content-events">
                                <Divider />
                                <Subheader>Events:</Subheader>
                                <List >
                                    {eventsArray}
                                </List>
                            </div>
                        ) : (
                            <div className="Content-events">
                                <Divider />
                                <Subheader>New events:</Subheader>
                                <List >
                                    {newEventsArray}
                                </List>
                                <Subheader>Events:</Subheader>
                                <List >
                                    {eventsArray}
                                </List>
                            </div>
                        )}

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