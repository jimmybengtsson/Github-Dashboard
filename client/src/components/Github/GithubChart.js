import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';
import FlatButton from 'material-ui/FlatButton';

import './Github.css';
let momentIterator = require('moment-iterator');

class GithubChart extends Component {

    constructor(props){
        super(props);

        this.state = {

            table: 'Week',
        };
        this.checkTableChange = this.checkTableChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    // Handle clicks between events
    handleClick(value) {
        this.setState({
            table: value,
        }, () => this.checkTableChange());

    }

    // Handle clicks for dates
    checkTableChange() {
        if(this.state.table === 'Year') {
            return this.getYear();

        }else if(this.state.table === 'Month') {
            return this.getMonth();

        } else {
            return this.getWeek();
        }

    }

    // Delete last data on mount
    deleteChartData() {

        data.labels = [];
        data.datasets[0].data = [];
        data.datasets[1].data = [];
        data.datasets[2].data = [];
    }

    // Get latest weeks events
    getWeek() {

        this.deleteChartData();

        let start = new Date();
        let temp = new Date().setDate(start.getDate() - 7);
        let end = new Date(temp);

        let tempArray = [];

        for (let i = 0; i < this.props.data.length; i++) {

            let convertTime = new Date(this.props.data[i].date);

            if(end.getTime() < convertTime.getTime()) {
                tempArray.push(this.props.data[i]);
            }
        }

        // Stringify to week-days
        momentIterator(end, start).each('days', function(d) {

            let commitData = 0;
            let issueData = 0;
            let releaseData = 0;

            tempArray.forEach((i) => {

                let convertTime = new Date(i.date).getDate();

                if(Number(d.format('D')) === Number(convertTime) && i.event === 'Commit') {
                    commitData = commitData + 1;
                }
                if(Number(d.format('D')) === Number(convertTime) && i.event === 'Issue') {
                    issueData = issueData + 1;
                }
                if(Number(d.format('D')) === Number(convertTime) && i.event === 'Release') {
                    releaseData = releaseData + 1;
                }
            });


            data.labels.push(d.format('ddd'));
            data.datasets[0].data.push(commitData);
            data.datasets[1].data.push(issueData);
            data.datasets[2].data.push(releaseData);
        });
    }

    // Get latest month events
    getMonth() {

        this.deleteChartData();

        let start = new Date();
        let temp = new Date().setMonth(start.getMonth() - 1);
        let end = new Date(temp);

        let tempArray = [];

        for (let i = 0; i < this.props.data.length; i++) {

            let convertTime = new Date(this.props.data[i].date);

            if(end.getTime() < convertTime.getTime()) {
                tempArray.push(this.props.data[i]);
            }
        }

        // Stringify to dates
        momentIterator(end, start).each('days', function(d) {

            let commitData = 0;
            let issueData = 0;
            let releaseData = 0;

            tempArray.forEach((i) => {

                let convertTime = new Date(i.date).getDate();

                if(Number(d.format('D')) === Number(convertTime) && i.event === 'Commit') {
                    commitData = commitData + 1;
                }
                if(Number(d.format('D')) === Number(convertTime) && i.event === 'Issue') {
                    issueData = issueData + 1;
                }
                if(Number(d.format('D')) === Number(convertTime) && i.event === 'Release') {
                    releaseData = releaseData + 1;
                }
            });

            data.labels.push(d.format('D'));
            data.datasets[0].data.push(commitData);
            data.datasets[1].data.push(issueData);
            data.datasets[2].data.push(releaseData);
        });
    }

    // Get latest year events
    getYear() {

        this.deleteChartData();

        let start = new Date();
        let temp = new Date().setFullYear(start.getFullYear() - 1);
        let end = new Date(temp);

        let tempArray = [];

        for (let i = 0; i < this.props.data.length; i++) {

            let convertTime = new Date(this.props.data[i].date);

            if(end.getTime() < convertTime.getTime()) {
                tempArray.push(this.props.data[i]);
            }
        }

        // Stringify to months
        momentIterator(end, start).each('months', function(d) {

            let commitData = 0;
            let issueData = 0;
            let releaseData = 0;

            tempArray.forEach((i) => {

                let convertTime = new Date(i.date).getMonth();

                if(Number(d.format('M')) === Number(convertTime) && i.event === 'Commit') {
                    commitData = commitData + 1;
                }
                if(Number(d.format('M')) === Number(convertTime) && i.event === 'Issue') {
                    issueData = issueData + 1;
                }
                if(Number(d.format('M')) === Number(convertTime) && i.event === 'Release') {
                    releaseData = releaseData + 1;
                }
            });

            data.labels.push(d.format('MMM'));
            data.datasets[0].data.push(commitData);
            data.datasets[1].data.push(issueData);
            data.datasets[2].data.push(releaseData);
        });
    }

    componentWillMount() {
        this.checkTableChange();
    }
    componentWillReceiveProps() {
        this.checkTableChange();
    }
    componentDidUpdate() {
        this.checkTableChange();
    }

    render() {
        return (
            <div className="Chart-body">
                <Line data={data} />
                <div className="Chart-buttons">
                    <FlatButton
                        label="Week"
                        primary={true}
                        onClick={() => this.handleClick('Week')}
                    />
                    <FlatButton
                        label="Month"
                        primary={true}
                        onClick={() => this.handleClick('Month')}
                    />
                    <FlatButton
                        label="Year"
                        primary={true}
                        onClick={() => this.handleClick('Year')}
                    />
                </div>
            </div>
        );
    }
}



export default GithubChart;

let data = {
    labels: [],
    datasets: [
        {
            label: 'Commits',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: []
        },
        {
            label: 'Issues',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(192, 6, 0, 0.4)',
            borderColor: 'rgba(192, 6, 0, 0.4)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(192, 6, 0, 0.4)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(192, 6, 0, 0.4)',
            pointHoverBorderColor: 'rgba(192, 6, 0, 0.4)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: []
        },
        {
            label: 'Releases',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(7, 192, 7, 0.4)',
            borderColor: 'rgba(7, 192, 7, 0.4)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(7, 192, 7, 0.4)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(7, 192, 7, 0.4)',
            pointHoverBorderColor: 'rgba(7, 192, 7, 0.4)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: []
        },
    ]
};