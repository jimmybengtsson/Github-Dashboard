import React, { Component } from 'react';
import './Dashboard.css';
import {getPersonalRepos, getRepoCommits} from "../../utils/Github/Requests";
import CircularProgress from 'material-ui/CircularProgress';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {grey400, grey800} from "material-ui/styles/colors";
let repoArray;


class Dashboard extends Component {

    constructor(props){
        super(props);

        this.state = {
            githubRepo: '',
            githubData: this.props.state.githubData,
            githubToken: this.props.state.githubToken,
            loaded: false,
            repoUrl: 'https://api.github.com/user/repos',
            renderedRepos: [],
            menuValue: 2,
        };
        this.handleMenuChange = this.handleMenuChange.bind(this);
    }

    handleMenuChange(event, index, value) {
        this.setState({
            menuValue: value,
        });
    }

   componentDidMount() {

        if (this.props.state.github) {

            repoArray = [];
            getPersonalRepos(this.props.state.githubToken, this.state.repoUrl)
                .then((response) => {
                    let tempValue = 0;

                    console.log(response);
                    repoArray = response;
                    response.forEach((i) => {

                        tempValue = tempValue + 1;
                        this.state.renderedRepos.push(<MenuItem value={tempValue} key={i.id} primaryText={i.name} data={i}/>);
                    })

                })
                .then(() => {
                    this.setState({
                        loaded: true,
                    });
                })
                .catch((err) => {
                    throw new Error(err);
                });
        }
    }

    render() {

        const githubLoggedIn = this.props.state.github;

        return (
            <div className="View-body">
                {githubLoggedIn ?  (
                    <div className="Github-body">
                            {this.state.loaded ?  (
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
                                    {this.state.renderedRepos}
                                </DropDownMenu>
                            ) : (
                                <CircularProgress style={style.spinner}/>
                            )}
                        <div className="Content-body">
                            {this.state.repoContent ? (
                                <p>Github Chart</p>
                            ) : (
                                <p className="message">Click on repository to view events!</p>
                            )}
                        </div>
                    </div>
                            ) : (
                    <div className="message">
                        <p>You have to sign in to Github to view this.</p>
                        <p>Please go to settings!</p>
                    </div>
                )}
            </div>
        );
    }
}

export default Dashboard;

const style = {
    spinner: {

        margin: 'auto',
    }
};