import React, { Component } from 'react';
import {getOrganizations} from "../../utils/Github/Requests";
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';

import './Github.css';
import {cyan500, grey400, grey800} from "material-ui/styles/colors";

let tempOrgs;

class GithubMenu extends Component {

    constructor(props){
        super(props);

        this.state = {
            menuValue: 1,
            orgs: [],
            isLoaded: false,
            renderedOrgs: [],
        };

        this.getOrganizations = this.getOrganizations.bind(this);
        this.handleMenuChange = this.handleMenuChange.bind(this);
    }

    // Handle organizations menu events
    handleMenuChange(event, index, value) {
        this.setState({
            menuValue: value,
            repoUrl: tempOrgs[value - 1].repos_url,
        });

        this.props.setRepoUrl(tempOrgs[value - 1].repos_url);
    }

    // Fetch all organizations from Github
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
                    throw new Error(err);
                });
    }

    componentDidMount() {

        if (this.state.orgs.length <= 0) {
            this.getOrganizations();
        }
    }

    render() {

        return (
            <div>
            {this.state.isLoaded ? (
                    <DropDownMenu
                        value={this.state.menuValue}
                        onChange={this.handleMenuChange}
                        selectedMenuItemStyle={{
                            color: grey800,
                        }}
                        menuItemStyle={{
                            color: grey400,
                        }}
                    >
                        {this.state.renderedOrgs}
                    </DropDownMenu>

                ) : (
                    <CircularProgress style={style.spinner}/>
                )}
            </div>
        );
    }
}

export default GithubMenu;


const style = {
    spinner: {

        margin: 'auto',
    }
};