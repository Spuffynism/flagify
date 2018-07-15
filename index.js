require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const SlackController = require('./slack-controller');

const app = express();
express.json();
app.use(bodyParser.urlencoded({ extended: true }));

const slackController = new SlackController(process.env.SLACK_TOKEN);

app.get('/', (req, res) => {
    res.send('nothing to see here...');
});

app.all('/flagify', (req, res) => slackController.handleCommand(req, res));

app.listen(3000, () => console.log('Listening on port 3000'));
