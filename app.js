const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const user = require('./api/user/index');
 
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

if(process.env.NODE_ENV !== 'development'){
    app.use(morgan('dev'));
}

app.use('/users',user);

module.exports = app;