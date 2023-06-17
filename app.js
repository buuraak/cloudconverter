const CloudConvert = require('cloudconvert');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3001;

app.post('/', (request, response) => {
app.use(express.json());

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN);
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    response.header('Access-Control-Allow-Methods', 'POST');
    next();
});
});

app.listen(port);
