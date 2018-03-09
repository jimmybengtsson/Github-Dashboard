import React, { Component } from 'react';
import {getOrganizations} from "../../utils/Github/Requests";

import './Github.css';

class Github extends Component {

    constructor(props){
        super(props);

        this.state = {
            user: this.props.state.user,
            githubData: this.props.state.githubData,
        };

        this.getUsersOrgs = this.getUsersOrgs.bind(this);
    }

    getUsersOrgs() {

        if (this.state.user === null || this.state.user === 'undefined') {
            return <div className="message">
                <p>You have to sign in to Github to view this.</p>
                <p>Please go to settings!</p>
            </div>;
        } else {

            getOrganizations(this.state.user.githubToken, this.state.githubData.login)
                .then((response) => {
                    console.log(response);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }


    componentDidMount() {

        this.setState({
            user: this.props.state.user,
            githubData: this.props.state.githubData,
        });
    }

    render() {
        return (
            <div className="View-body">
                {this.getUsersOrgs()}
            </div>
        );
    }
}

export default Github;
