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

        console.log(props);
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
        console.log(i);
        this.props.setRepoContent(i);
    }

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
            /*.then(() => {
                this.props.setRepoContent(tempRepos[this.state.menuValue - 1].props.data.events_url);
            })*/
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
