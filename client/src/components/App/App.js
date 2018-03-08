import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';

// Material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import {cyan500} from 'material-ui/styles/colors';

import Dashboard from '../Dashboard/Dashboard';
import Github from '../Github/Github';
import Settings from '../Settings/Settings';
import SignIn from '../Auth/SignIn';
import Register from '../Auth/Register';

require('dotenv').config();

class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            page: 'Dashboard',
            menuValue: 1,
        };
        //this.isSignedIn = this.isSignedIn.bind(this);
    }

    handleChange = (event, index, menuValue) => this.setState({menuValue});


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

                          <Route path="/" exact={true} component={Dashboard}/>
                          <Route path="/github" component={Github}/>
                          <Route path="/settings" component={Settings}/>
                          <Route path="/signin" component={SignIn}/>
                          <Route path="/register" component={Register}/>
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
