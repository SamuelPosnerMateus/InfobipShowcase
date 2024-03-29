const express = require('express');
const config = require('./config.json');
const https = require('./lib/https')();
const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const AUTH = 'App ' + config.INFOBIP_API_KEY;
const IDENTITY_PREFIX = 'user';
let counter = 1;

app.post('/token', (req, res) => {
    let identity = IDENTITY_PREFIX + counter;
    let body = JSON.stringify({identity: identity});
    https.post(config.INFOBIP_API_HOST, config.INFOBIP_RTC_TOKEN_PATH, body, AUTH)
        .then(tokenResponse => {
            counter++;
            let response = JSON.parse(tokenResponse);
            response.identity = identity;
            res.json(response);
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
});

app.post('/token/:identity', (req, res) => {
    let identity = req.params.identity;
    let body = JSON.stringify({identity: identity});
    https.post(config.INFOBIP_API_HOST, config.INFOBIP_RTC_TOKEN_PATH, body, AUTH)
        .then(tokenResponse => {
            let response = JSON.parse(tokenResponse);
            response.identity = identity;
            res.json(response);
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
});

app.listen(config.HTTP_PORT, () => console.log('Token Application started at: http://%s:%s', 'localhost', config.HTTP_PORT));