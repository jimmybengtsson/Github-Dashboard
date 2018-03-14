import React, { Component } from 'react';
import './Settings.css';
import {getOrgRepos} from "../../utils/Github/Requests";
import CircularProgress from 'material-ui/CircularProgress';
import {GridList} from 'material-ui/GridList';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import {fetchWebhookSettings, updateWebhookSettings} from "../../utils/Firebase/Database";
import Snackbar from 'material-ui/Snackbar';
import {createWebhook} from "../../utils/Github/Webhook";


let tempRepos;
let oldRepoSettings;

class SettingsGithubRepos extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoaded: false,
            checked: [],
            openSnackBar: false,
            snackBarMessage: ''
        };

        this.updateCheck = this.updateCheck.bind(this);
        this.getCheckedState = this.getCheckedState.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeSnackBar = this.closeSnackBar.bind(this);
        this.getSettingsFromDB = this.getSettingsFromDB.bind(this);
    }

    // Handle message-bar state
    closeSnackBar() {
        this.setState({
            openSnackBar: false,
            snackBarMessage: '',
        });
    };

    // Handle all input for webhooks on repos
    updateCheck(objId, objKey) {

        let stateCopy = this.state.checked;

        for (let i = 0; i < stateCopy.length; i++) {
            if (stateCopy[i].id === objId) {

                for (let key in stateCopy[i].checked) {
                    if (key === objKey) {

                        stateCopy[i].checked[key] = !stateCopy[i].checked[key];
                    }
                }
            }
        }

        this.setState({
            checked: stateCopy,
        });

    }

    // Get all input for webhooks on repos
    getCheckedState(objId, objKey) {

        let stateCopy = this.state.checked;

        for (let i = 0; i < stateCopy.length; i++) {
            if (stateCopy[i].id === objId) {

                for (let key in stateCopy[i].checked) {
                    if (key === objKey) {

                        return Object.values(stateCopy[i].checked[key]);
                    }
                }
            }
        }
    }

    // Create webhooks and save settings to db when user submits
    handleSubmit() {

        this.state.checked.forEach((i) => {
            updateWebhookSettings(this.props.data.user.uid, i);

        });

        createWebhook(this.props.data.githubToken, this.state.checked, oldRepoSettings, this.props.data.user.uid)
            .then(() => {
                this.setState({
                    openSnackBar: true,
                    snackBarMessage: 'Github webhooks saved!',

                });
            });
    }

    // Fetch webhook settings
    getSettingsFromDB() {
        fetchWebhookSettings(this.props.data.user.uid)
            .then((response) => {
                return response.val();
            })
    }

    // Fetch users repos and render to Checkbox-objects that is added to gridlist
    getRepos(url) {

        tempRepos = [];

        getOrgRepos(this.props.data.githubToken, url)
            .then((response) => {
                let tempValue = 0;

                response.forEach((i) => {

                    let checkboxObj = {
                        id: i.id,
                        name: i.name,
                        hook: i.hooks_url,
                        checked: {
                            commit: false,
                            issue: false,
                            release: false,
                        }
                    };

                    if(this.state.database.length <= 0) {
                        this.state.checked.push(checkboxObj);
                    } else if (this.state.database[i.id]) {
                        this.state.checked.push(this.state.database[i.id]);
                    } else {
                        this.state.checked.push(checkboxObj);
                    }


                    tempValue = tempValue + 1;
                    tempRepos.push(
                        <Paper style={styles.paper} zDepth={1} data={i} value={tempValue} key={i.id} name={i.name}>
                            <p key={'Title'}>{i.name}</p>
                            <Checkbox
                                label="Commits"
                                onCheck={() => this.updateCheck(i.id, 'commit')}
                                style={styles.checkbox}
                                labelPosition={'left'}
                                key={'commit'}
                                id={i.id}
                                defaultChecked={this.state.checked.find(x => x.id === i.id).checked.commit}
                            />
                            <Checkbox
                                label="Issues"
                                onCheck={() => this.updateCheck(i.id, 'issue')}
                                style={styles.checkbox}
                                labelPosition={'left'}
                                key={'issue'}
                                id={i.id}
                                defaultChecked={this.state.checked.find(x => x.id === i.id).checked.issue}
                            />
                            <Checkbox
                                label="Releases"
                                onCheck={() => this.updateCheck(i.id, 'release')}
                                style={styles.checkbox}
                                labelPosition={'left'}
                                key={'release'}
                                id={i.id}
                                defaultChecked={this.state.checked.find(x => x.id === i.id).checked.release}
                            />
                        </Paper>);

                });
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

    componentWillMount() {

        fetchWebhookSettings(this.props.data.user.uid)
            .then((response) => {

                if(response.val() || Array.isArray(response.val())) {
                    this.setState({
                        database: response.val(),
                    });

                    oldRepoSettings = response.val();

                } else {
                    this.setState({
                        database: [],
                    });
                }
            }).then(() => {

                this.getRepos(this.props.repoUrl);
        });
    }

    componentWillReceiveProps(nextProps) {

        fetchWebhookSettings(this.props.data.user.uid)
            .then((response) => {

                if(response.val() || Array.isArray(response.val())) {
                    this.setState({
                        database: response.val(),
                    });

                } else {
                    this.setState({
                        database: [],
                    });
                }
            }).then(() => {

                this.getRepos(nextProps.repoUrl);
        });
    }

    render() {
        return (
            <div style={styles.root}>
                {this.state.isLoaded ? (
                    <div>
                        <GridList
                            cellHeight={'auto'}
                            style={styles.gridList}
                            cols={3}
                        >
                            {tempRepos}
                        </GridList>
                        <FlatButton
                            label="Save"
                            primary={true}
                            onClick={() => this.handleSubmit()}
                            style={styles.button}
                            labelStyle={styles.buttonInline}
                        />
                    </div>
                ) : (
                    <CircularProgress style={styles.spinner}/>
                )}
                <Snackbar
                    open={this.state.openSnackBar}
                    message={this.state.snackBarMessage}
                    autoHideDuration={4000}
                    onRequestClose={this.closeSnackBar}
                />
            </div>

        );
    }
}

export default SettingsGithubRepos;

const styles = {
    spinner: {

        margin: 'auto',
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        width: '100%',
        height: '80%',
    },
    gridList: {
        width: '100%',
        height: '80%',
        overflowY: 'auto',
    },
    paper: {
        height: 180,
        width: 180,
        margin: 20,
        textAlign: 'left',
        display: 'inline-block',
        padding: 10
    },
    checkbox: {
        marginBottom: 20,
        fontSize: '80%',
        color: '#636363',
    },
    button: {
        float: 'right',
        marginRight: 10,
    },
    buttonInline: {

        fontSize: '120%',
    }
};
