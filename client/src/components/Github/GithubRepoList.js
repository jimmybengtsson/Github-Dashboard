import React, { Component } from 'react';
import {getOrgRepos} from "../../utils/Github/Requests";
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import './Github.css';

let tempRepos;

class GithubRepoList extends Component {

    constructor(props){
        super(props);
        
        this.state = {
            menuValue: 1,
            isLoaded: false,
        };

        this.getRepos = this.getRepos.bind(this);
    }

    handleMenuChange(i, value) {
        this.setState({
            menuValue: value,
        });

        this.props.setRepoContent(i);
    }

    // Fetch all repos for a organization from Github
    getRepos(url) {

        tempRepos = [];
        getOrgRepos(this.props.githubToken, url)
            .then((response) => {
                let tempValue = 0;

                response.forEach((i) => {

                    tempValue = tempValue + 1;
                    tempRepos.push(<ListItem value={tempValue} key={i.id} primaryText={i.name} data={i} onClick={this.handleMenuChange.bind(this, i, tempValue)}/>);
                });
            })
            .then(() => {
                this.setState({
                    isLoaded: true,
                });
            })
            .catch((err) => {
                throw new Error(err);
            });
    }

    componentDidMount() {
        this.getRepos(this.props.state.repoUrl);
    }

    componentWillReceiveProps(nextProps) {
        this.getRepos(nextProps.state.repoUrl);
    }

    render() {

        return (
            <div className="List">
                <Divider />
                <Subheader>Repositories:</Subheader>
                <List >
                    {tempRepos}
                    </List>
                <Divider />
            </div>
        );
    }
}

export default GithubRepoList;
