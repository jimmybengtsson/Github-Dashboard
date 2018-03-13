import React, { Component } from 'react';
import './Settings.css';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
import {getUserInfo} from "../../utils/Github/Requests";

import { GithubAuth, SignOut } from '../../utils/Firebase/SignIn';
import SettingsGithub from "./SettingsGithub";

class Settings extends Component {

    constructor(props){
        super(props);

        this.state = {
            github: this.props.state.github,
            philipsHue: this.props.state.philipsHue,

        };
        this.githubState = this.githubState.bind(this);
    }

    githubState() {

        console.log(this.state);

        if (this.state.github === true) {

            SignOut()
                .then(() => {

                this.props.handleStateChange(false, false, false, false, true, 'Signed out from Github');

                })
                .catch((err) => {
                throw new Error(err);

            });
        } else {

            // Sign in to Github. Popup.
            GithubAuth()
                .then((result) => {

                    getUserInfo(result.githubToken)

                        .then((response) => {

                            this.props.handleStateChange(true, response.data, result.info, result.githubToken, true, 'Signed in to Github');
                        });
                })
                .catch((err) => {
                throw new Error(err);
                });
        }
    }

    render() {

        return (
            <div className="View-body">
                <div className="Signin-body">
                    <Subheader>Notifications</Subheader>
                    <Divider />
                    <List>
                        <Subheader>Receive from:</Subheader>
                        <ListItem
                            primaryText="Github"
                            secondaryText="Sign in to github"
                            rightToggle={
                                <Toggle
                                    toggled={this.state.github}
                                    onClick={() => this.githubState()}
                                />}
                            initiallyOpen={true}


                        />
                    </List>
                    <Divider />
                    <List>
                        <Subheader>Send to:</Subheader>
                        <ListItem primaryText="Philips Hue" rightToggle={<Toggle />} />
                        <ListItem primaryText="Browser" rightToggle={<Toggle />} />
                    </List>
                </div>
                <div className="Settings-body">
                    {this.state.github ? (
                        <SettingsGithub data={this.props.state}/>
                    ) : (
                        <div className="message">
                            <p>You have to sign in to Github to view this.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Settings;
