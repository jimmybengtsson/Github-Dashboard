/**
 * Created by jimmybengtsson on 2018-02-08.
 */
'use strict';

let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');

require('dotenv').config();

let startUserDB = require('./src/models/UserDB').startUserDB;

startUserDB();

let app = express();
let port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(cors());

app.listen(port, () => {
    console.log('API server started on: ' + port);
});