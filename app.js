const express = require('express');
const config = require('./config/appconfig');
const apiRoutes = require('./config/routes');
const mongooseConnect = require('./config/database');
const bodyParser = require('body-parser');

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.use(mongooseConnect);

app.use('/api', apiRoutes);

// Error handling
app.use((error, req, res, next) => {
    if(!error.status || error.status === 500) {
        res.status(500).json({
            status: 0,
            message: "Something went wrong, Please try again later."
        });
    } else {
        res.status(error.status).json({
            status: 0,
            message: error.message
        });
    }
});

// 404 handling
app.use('/', (req, res, next) => {
    res.status(404).json({
        status: 0,
        message: "Please enter valid end point and method."
    });
});

app.listen(config.app.port);