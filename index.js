require('dotenv').config();
const express = require('express');
const url = require('url');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
express.json();
app.use(bodyParser.urlencoded({extended: true}));

const replaceWithFlags = text => {
    const flagCodes = ["ac", "ad", "ae", "af", "ag", "ai", "al", "am", "ao", "aq", "ar", "as", "at",
        "au", "aw", "ax", "az", "ba", "bb", "bd", "be", "bf", "bg", "bh", "bi", "bj", "bl", "bm",
        "bn", "bo", "bq", "br", "bs", "bt", "bv", "bw", "by", "bz", "ca", "cc", "cd", "cf", "cg",
        "ch", "ci", "ck", "cl", "cm", "cn", "co", "cp", "cr", "cu", "cv", "cw", "cx", "cy", "cz",
        "de", "dg", "dj", "dk", "dm", "do", "dz", "ea", "ec", "ee", "eg", "eh", "er", "es", "et",
        "eu", "fi", "fj", "fk", "fm", "fo", "fr", "ga", "gb", "gd", "ge", "gf", "gg", "gh", "gi",
        "gl", "gm", "gn", "gp", "gq", "gr", "gs", "gt", "gu", "gw", "gy", "hk", "hm", "hn", "hr",
        "ht", "hu", "ic", "id", "ie", "il", "im", "in", "io", "iq", "ir", "is", "it", "je", "jm",
        "jo", "jp", "ke", "kg", "kh", "ki", "km", "kn", "kp", "kr", "kw", "ky", "kz", "la", "lb",
        "lc", "li", "lk", "lr", "ls", "lt", "lu", "lv", "ly", "ma", "mc", "md", "me", "mf"];
    const flagsExpression = new RegExp(flagCodes.join('|'), 'ig');

    return text.replace(flagsExpression, ':flag-$&:');
};

app.get('/', (req, res) => {
    res.send('nothing to see here...');
});

app.all('/flagify', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send('');

    const body = JSON.stringify({
        channel: req.body.channel_id,
        response_type: "ephemeral",
        text: replaceWithFlags(req.body.text),
        as_user: req.body.user_name,
    });

    const options = {
        hostname: 'slack.com',
        path: '/api/chat.postMessage',
        method: 'POST',
        port: 443,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(body),
            'Authorization': 'Bearer ' + process.env.SLACK_TOKEN
        }
    };

    const request = https.request(options, (response) => {
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
            console.log('response: ' + chunk);
        });
    });

    request.write(body);
    request.end();
});

app.listen(3000);