import React, { Component } from 'react';
import {getOrganizations, getOrgRepos} from "../../utils/Github/Requests";
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import './Github.css';

let tempOrgs;

class GithubMenu extends Component {

    constructor(props){
        super(props);

        console.log(props);
        this.state = {
            menuValue: 1,
            orgs: [],
            isLoaded: false,
            renderedOrgs: [],
        };

        this.getOrganizations = this.getOrganizations.bind(this);
        this.handleMenuChange = this.handleMenuChange.bind(this);
    }

    handleMenuChange(event, index, value) {
        this.setState({
            menuValue: value,
            repoUrl: tempOrgs[value - 1].repos_url,
        });

        this.props.setRepoUrl(tempOrgs[value - 1].repos_url);
    }

    getOrganizations() {
            getOrganizations(this.props.githubToken)
                .then((response) => {
                    let tempValue = 0;

                    tempOrgs = response;

                    response.forEach((i) => {

                        tempValue = tempValue + 1;
                        this.state.renderedOrgs.push(<MenuItem value={tempValue} key={i.id} primaryText={i.login} data={i}/>);
                    });
                })
                .then(() => {
                    this.props.setRepoUrl(tempOrgs[this.state.menuValue - 1].repos_url);
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
        if (this.state.orgs.length <= 0) {
            this.getOrganizations();
        }
    }

    render() {

        console.log(this.state);

        return (
            <div>
            {this.state.isLoaded ? (
                    <DropDownMenu value={this.state.menuValue} onChange={this.handleMenuChange}>
                        {this.state.renderedOrgs}
                    </DropDownMenu>

                ) : (
                    <CircularProgress />
                )}
            </div>
        );
    }
}

export default GithubMenu;
