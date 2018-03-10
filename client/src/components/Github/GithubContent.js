import React, { Component } from 'react';

import './Github.css';

class GithubContent extends Component {

    constructor(props){
        super(props);

        console.log(props);
        this.state = {
            isLoaded: false,
        };

    }


    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {

        return (
            <div>
                <p>Content</p>
            </div>
        );
    }
}

export default GithubContent;
