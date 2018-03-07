import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import '../style/App.css';

// Material UI
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';

import Dashboard from './Dashboard';
import Github from './Github';
import Settings from './Settings';

class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            page: 'Dashboard',
        };
        //this.isSignedIn = this.isSignedIn.bind(this);
    }

  render() {
    return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <Router>
                      <div className="App">
                          <AppBar title={this.state.page} />
                          <Route path="/" exact={true} component={Dashboard}/>
                          <Route path="/github" component={Github}/>
                          <Route path="/settings" component={Settings}/>
                      </div>
                </Router>
            </MuiThemeProvider>

    );
  }
}

export default App;
