import React, { Component } from 'react';
import {getOrganizations, getOrgRepos} from "../../utils/Github/Requests";
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import './Github.css';

let tempRepos;

class GithubRepoList extends Component {

    constructor(props){
        super(props);

        console.log(props);
        this.state = {
            menuValue: 1,
            isLoaded: false,
        };

        this.handleMenuChange = this.handleMenuChange.bind(this);
        this.getRepos = this.getRepos.bind(this);
    }

    handleMenuChange(event, index, value) {
        this.setState({
            menuValue: value,
        });
    }

    getRepos(url) {

        tempRepos = [];
        getOrgRepos(this.props.githubToken, url)
            .then((response) => {
                let tempValue = 0;

                response.forEach((i) => {

                    tempValue = tempValue + 1;
                    tempRepos.push(<ListItem value={tempValue} key={i.id} primaryText={i.full_name} data={i}/>);
                });
            })
            .then(() => {
                this.setState({
                    isLoaded: true,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    componentDidMount() {
        this.getRepos(this.props.state.repoUrl);
    }

    componentWillReceiveProps(nextProps) {
        this.getRepos(nextProps.state.repoUrl);
    }

    render() {

        console.log(this.state);

        return (
            <div className="List">
                <List>
                    {tempRepos}
                    </List>
            </div>
        );
    }
}

export default GithubRepoList;
