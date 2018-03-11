import React, { Component } from 'react';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

import './Github.css';
let moment = require('moment');

class GithubEvent extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoaded: false,
            expanded: false,
        };

    }

    handleExpandChange = (expanded) => {
        this.setState({expanded: expanded});
    };

    handleExpand = () => {
        this.setState({expanded: true});
    };

    handleReduce = () => {
        this.setState({expanded: false});
    };

    getAvatar = (avatar) => {
      if(avatar) {
          this.setState({
              avatarUrl: avatar,
          });
      } else {
          this.setState({
              avatarUrl: 'https://avatars3.githubusercontent.com/u/19864447?v=4',
          });
      }
    };

    getTitle = () => {

        return this.props.event + ' by ' + this.props.author;
    };

    getTimeSince = () => {
        return moment(this.props.date).fromNow();
    };

    getDate = () => {
        return moment(this.props.date).format('MMMM Do YYYY, kk:mm')
    };

    componentDidMount() {
        this.getAvatar(this.props.avatar);
    }

    render() {

        return (
            <div className="Event">
                <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
                    <CardHeader
                        title={this.getTitle()}
                        subtitle={this.getTimeSince()}
                        avatar={this.state.avatarUrl}
                        actAsExpander={true}
                        showExpandableButton={true}
                    />
                    <CardText
                        expandable={true}
                        style={{fontSize: '110%', marginBottom: '-20px'}}
                    >
                        {this.props.message}
                    </CardText>
                    <CardText
                        expandable={true}
                        color={'#737373'}
                        style={{fontSize: '70%'}}
                    >
                        {this.getDate()}
                    </CardText>
                    <CardActions expandable={true}>
                        <FlatButton
                            label="Visit"
                            primary={true}
                            onClick={this.handleReduce}
                            href={this.props.url}
                            target="_blank"
                        />
                    </CardActions>
                </Card>
            </div>
        );
    }
}

export default GithubEvent;