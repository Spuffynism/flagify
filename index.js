require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const SlackController = require('./slack-controller');

const port = parseInt(process.env.PORT, 10) || 3000;

const app = express();
express.json();
app.use(bodyParser.urlencoded({ extended: true }));

const slackController = new SlackController(process.env.SLACK_TOKEN);

app.get('/', (req, res) => res.send('nothing to see here...'));

app.post('/flagify', (req, res) => slackController.handleCommand(req, res));

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`> listening on port ${port}`);
    });
} else {
    module.exports = app;
}
