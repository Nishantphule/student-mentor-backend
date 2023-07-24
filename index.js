const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('./utils/config');
const middleware = require('./utils/middleware');

// create an express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

// set the strictQuery to false, so that it will disable the strict mode for the query filters
// mongoose will not throw any error when we use an undefined field in the query (ignored)
mongoose.set('strictQuery', false);

logger.info('connecting to', config.MONGO_URL);

// to connect to the database
mongoose.connect(config.MONGO_URL)
    .then(result => {
        console.log('Connected to MongoDB Database');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message);
    })


// set the endpoints
const studentsRouter = require('./controllers/students');
const mentorsRouter = require('./controllers/mentors');

// root end point: prints hello world as an HTML
app.get('/', (request, response) => {
    response.send(
        `<h1> Welcome to Student Mentor Management! </h1>
        `);
});

// fetches all resources in the collection
app.use('/api/students', studentsRouter);
app.use('/api/mentors', mentorsRouter);

// middle ware
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler);

// Listen to the PORT for requests
app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});
