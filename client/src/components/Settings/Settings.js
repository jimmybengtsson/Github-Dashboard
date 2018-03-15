import React, { Component } from 'react';
import './Settings.css';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
import {getUserInfo} from "../../utils/Github/Requests";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import { GithubAuth, SignOut } from '../../utils/Firebase/SignIn';
import SettingsGithub from "./SettingsGithub";
import {handlePhilipsHueUrl} from "../../utils/Firebase/Database";

class Settings extends Component {

    constructor(props){
        super(props);

        this.state = {
            github: this.props.state.github,
            philipsHueUrl: this.props.state.philipsHueUrl,
            philipsHue: this.props.state.philipsHue,
            textField: false,
            textValue: '',

        };
        this.githubState = this.githubState.bind(this);
        this.handlePhilipsHueSubmit = this.handlePhilipsHueSubmit.bind(this);
    }

    // Close philips hue url input
    closeTextField = () => {
        this.setState({
            textField: false
        });
    };

    // Handle philips url text input
    handleTextChange = (event) => {
        this.setState({
            textValue: event.target.value,
        });
    };

    // Check if signed in to Github
    githubState() {

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

    // Check if users db includes hue url
    philpsHueState() {

        if (this.state.philipsHue === true) {

            handlePhilipsHueUrl(this.props.state.user.uid, '')
                .then(() => {
                    this.props.handlePhilipsHue(false,  'Removed Philips Hue URL');
                });
        } else {

            this.setState({
                textField: true,
            });
        }
    }

    // Update philips hue url to users db
    handlePhilipsHueSubmit() {

        this.setState({
            textField: false
        });

        handlePhilipsHueUrl(this.props.state.user.uid, this.state.textValue)
            .then(() => {
                this.props.handlePhilipsHue(true, 'Added Philips Hue URL');
            })
    }

    render() {

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.closeTextField}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onClick={this.handlePhilipsHueSubmit}
            />,
        ];

        return (
            <div className="View-body">
                <div className="Signin-body">
                    <Subheader style={{fontSize: '120%'}}>Notifications</Subheader>
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
                        <ListItem primaryText="Philips Hue" secondaryText="Add URL for server" rightToggle={<Toggle toggled={this.state.philipsHue}
                                                                                 onClick={() => this.philpsHueState()}/>} />
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
                <Dialog
                    contentStyle={{textAlign: 'center'}}
                    title="Please enter url for the server controlling your Hue-lights!"
                    modal={false}
                    open={this.state.textField}
                    onRequestClose={this.closeTextField}
                >
                    <div className="Inner-dialog">
                    <TextField
                        value={this.state.value}
                        onChange={this.handleTextChange}
                        id={'text-field-controlled'}
                    />
                        <div>
                            {actions}
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default Settings;
