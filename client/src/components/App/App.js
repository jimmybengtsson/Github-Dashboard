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
import {cyan500} from 'material-ui/styles/colors';
import Snackbar from 'material-ui/Snackbar';

import Dashboard from '../Dashboard/Dashboard';
import Github from '../Github/Github';
import Settings from '../Settings/Settings';
import {updateUserData} from "../../utils/Firebase/Database";

class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            menuValue: 1,
            github: false,
            openSnackBar: false,
            snackBarMessage: ''
        };
        this.handleStateChange = this.handleStateChange.bind(this);
        this.closeSnackBar = this.closeSnackBar.bind(this);
    }

    handleChange = (event, index, menuValue) => this.setState({menuValue});

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

    closeSnackBar() {
        this.setState({
            openSnackBar: false,
            snackBarMessage: '',
        });
    };

    componentWillMount() {
        if(localStorage.getItem('userData')) {

            let userData = JSON.parse(localStorage.getItem('userData'));

            console.log(userData);

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

                    console.log(this.state);
                    let userData = {
                        githubToken: this.state.githubToken,
                        githubName: this.state.githubData.login,
                        githubId: this.state.githubData.id,
                    };
                    updateUserData(this.state.user.uid, userData)
                })
                .catch((error) => {
                    console.log(error);
                });

        } else {
            this.setState({
                githubData: false,
                user: false,
                github: false,
                githubToken: false,
            });
        }
    }

    render() {
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
                <Router>
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
                          <Route path="/settings" component={() => <Settings state={this.state} handleStateChange={this.handleStateChange}/>}/>
                          <Snackbar
                              open={this.state.openSnackBar}
                              message={this.state.snackBarMessage}
                              autoHideDuration={4000}
                              onRequestClose={this.closeSnackBar}
                          />
                      </div>
                </Router>
        </MuiThemeProvider>

    );
  }
}

export default App;


const muiTheme = getMuiTheme({
    toolbar: {
        backgroundColor: cyan500,
        accent1Color: cyan500,
        height: 60,
        titleFontSize: 20,
    },
});

const style = {
    labelStyle: {
        fontSize: 26,
        color: 'white',
    },
    iconStyle: {
        fontSize: 26,
        color: 'white',
        opacity: 1,
    },
    anchorOrigin: {
        vertical: 'top',
        horizontal: 'left',
    },
    menuItemStyle: {
        fontSize: 26,
        marginTop: 10,
        marginBottom: 10,
    },
    selectedMenuItemStyle: {
        color: cyan500,
    }

};
