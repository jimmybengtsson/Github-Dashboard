import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';
import { getUserInfo } from "../../utils/Github/Requests";

// Material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import {cyan500, grey800} from 'material-ui/styles/colors';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';

import Dashboard from '../Dashboard/Dashboard';
import Github from '../Github/Github';
import Settings from '../Settings/Settings';
import {createWebhookIdArray, fetchUserData, updateUserData} from "../../utils/Firebase/Database";

class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            menuValue: 1,
            github: false,
            openSnackBar: false,
            snackBarMessage: '',
            loaded: false,
        };
        this.handleStateChange = this.handleStateChange.bind(this);
        this.closeSnackBar = this.closeSnackBar.bind(this);
        this.handlePhilipsHue = this.handlePhilipsHue.bind(this);
    }

    // Handle menu-navigation
    handleChange = (event, index, menuValue) => this.setState({menuValue});

    // Handle state for authentication
    handleStateChange(value, github, firebase, token, openSB, messageSB) {
        this.setState({

            github: value,
            githubData: github,
            user: firebase,
            githubToken: token,
            openSnackBar: openSB,
            snackBarMessage: messageSB,

        });
    }

    // Set state for Philips Hue when adding url.
    handlePhilipsHue(value, message) {
        this.setState({

            philipsHue: value,
            openSnackBar: true,
            snackBarMessage: message,

        });
    }

    // Close message bar. Gets called after 4 seconds.
    closeSnackBar() {
        this.setState({
            openSnackBar: false,
            snackBarMessage: '',
        });
    };

    // Check authentication and fetch data before mount.
    componentWillMount() {
        if(localStorage.getItem('userData')) {

            let userData = JSON.parse(localStorage.getItem('userData'));

            getUserInfo(userData.githubToken)
                .then((response) => {

                    console.log(response);
                    this.setState({
                        githubData: response.data,
                        github: true,
                        user: userData.info,
                        githubToken: userData.githubToken,
                    });

                })
                .then(() => {

                    let userData = {
                        githubName: this.state.githubData.login,
                        githubId: this.state.githubData.id,
                    };

                    updateUserData(this.state.user.uid, userData);
                })
                .then(() => {

                    fetchUserData(this.state.user.uid)
                        .then((response) => {

                            if (response.val().philipsHueUrl.length > 0) {
                                this.setState({
                                    philipsHueUrl: response.val().philipsHueUrl,
                                    philipsHue: true,
                                });
                            } else {
                                this.setState({
                                    philipsHue: false,
                                });
                            }
                            if (response.val().browserNotification) {
                                this.setState({
                                    browserNotification: response.val().browserNotification
                                });
                            }
                            if(!response.val().webhookId) {
                                let webhookId = ['123', '321'];
                                createWebhookIdArray(this.state.user.uid, webhookId);
                            }
                        });

                    this.setState({
                        loaded: true,
                    });
                })
                .catch((error) => {
                    throw new Error(error);
                });

        } else {
            this.setState({
                githubData: false,
                user: false,
                github: false,
                githubToken: false,
                loaded: true,
            });
        }
    }

    render() {
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
                <Router>
                    {this.state.loaded ? (

                        <div className="App">

                            <Toolbar>
                                <ToolbarGroup firstChild={true}>
                                    <DropDownMenu value={this.state.menuValue}
                                                  onChange={this.handleChange}
                                                  labelStyle={style.labelStyle}
                                                  iconStyle={style.iconStyle}
                                                  menuStyle={style.menuStyle}
                                                  menuItemStyle={style.menuItemStyle}
                                                  selectedMenuItemStyle={style.selectedMenuItemStyle}
                                    >
                                        <MenuItem value={1} primaryText="Dashboard" containerElement={<Link to="/" />}/>
                                        <MenuItem value={2} primaryText="Github" containerElement={<Link to="/github" />}/>
                                        <MenuItem value={3} primaryText="Settings" containerElement={<Link to="/settings" />}/>
                                    </DropDownMenu>
                                </ToolbarGroup>
                            </Toolbar>
                            <Route path="/" exact={true} component={() => <Dashboard state={this.state}/>} />
                            <Route path="/github" component={() => <Github state={this.state}/>}/>
                            <Route path="/settings" component={() => <Settings state={this.state} handleStateChange={this.handleStateChange} handlePhilipsHue={this.handlePhilipsHue}/>}/>
                            <Snackbar
                                open={this.state.openSnackBar}
                                message={this.state.snackBarMessage}
                                autoHideDuration={4000}
                                onRequestClose={this.closeSnackBar}
                            />
                        </div>
                    ) : (

                        <CircularProgress style={style.spinner}/>
                    )}

                </Router>
        </MuiThemeProvider>

    );
  }
}

export default App;


const muiTheme = getMuiTheme({
    toolbar: {
        backgroundColor: grey800,
        accent1Color: grey800,
        height: 60,
        titleFontSize: 20,
    },
});

const style = {
    labelStyle: {
        fontSize: 22,
        color: 'white',
    },
    iconStyle: {
        fontSize: 22,
        color: 'white',
        opacity: 1,
    },
    anchorOrigin: {
        vertical: 'top',
        horizontal: 'left',
    },
    menuItemStyle: {
        fontSize: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    selectedMenuItemStyle: {
        color: cyan500,
    },
    spinner: {

        margin: 'auto',
    }

};
