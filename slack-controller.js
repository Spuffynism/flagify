const https = require('https');

class SlackController {
    constructor(authToken) {
        this.authToken = authToken;
    }

    handleCommand(req, res) {
        res.set('Content-Type', 'application/json');
        res.send(''); // slack needs an immediate message reception confirmation

        this.sendFlagifiedMessage(req.body);
    }

    sendFlagifiedMessage(requestBody) {
        const body = SlackController.buildRequestBody(
            requestBody.channel_id,
            requestBody.text,
            requestBody.user_name,
        );

        const request = this.buildRequest(body);

        request.write(body);
        request.end();
    }

    static buildRequestBody(channelId, text, username) {
        return JSON.stringify({
            channel: channelId,
            response_type: 'ephemeral',
            text: SlackController.replaceTextWithFlags(text),
            as_user: username,
        });
    }

    buildRequest(body) {
        const options = {
            hostname: 'slack.com',
            path: '/api/chat.postMessage',
            method: 'POST',
            port: 443,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(body),
                Authorization: `Bearer ${this.authToken}`,
            },
        };

        return https.request(options, (response) => {
            response.setEncoding('utf8');
            response.on('data', (chunk) => {
                // eslint-disable-next-line no-console
                console.log(`response: ${chunk}`);
            });
        });
    }

    static replaceTextWithFlags(text) {
        const flagCodes = [
            'ac', 'ad', 'ae', 'af', 'ag', 'ai', 'al', 'am', 'ao', 'aq', 'ar', 'as', 'at', 'au',
            'aw', 'ax', 'az', 'ba', 'bb', 'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bl', 'bm',
            'bn', 'bo', 'bq', 'br', 'bs', 'bt', 'bv', 'bw', 'by', 'bz', 'ca', 'cc', 'cd', 'cf',
            'cg', 'ch', 'ci', 'ck', 'cl', 'cm', 'cn', 'co', 'cp', 'cr', 'cu', 'cv', 'cw', 'cx',
            'cy', 'cz', 'de', 'dg', 'dj', 'dk', 'dm', 'do', 'dz', 'ea', 'ec', 'ee', 'eg', 'eh',
            'er', 'es', 'et', 'eu', 'fi', 'fj', 'fk', 'fm', 'fo', 'fr', 'ga', 'gb', 'gd', 'ge',
            'gf', 'gg', 'gh', 'gi', 'gl', 'gm', 'gn', 'gp', 'gq', 'gr', 'gs', 'gt', 'gu', 'gw',
            'gy', 'hk', 'hm', 'hn', 'hr', 'ht', 'hu', 'ic', 'id', 'ie', 'il', 'im', 'in', 'io',
            'iq', 'ir', 'is', 'it', 'je', 'jm', 'jo', 'jp', 'ke', 'kg', 'kh', 'ki', 'km', 'kn',
            'kp', 'kr', 'kw', 'ky', 'kz', 'la', 'lb', 'lc', 'li', 'lk', 'lr', 'ls', 'lt', 'lu',
            'lv', 'ly', 'ma', 'mc', 'md', 'me', 'mf',
        ];
        const flagsExpression = new RegExp(flagCodes.join('|'), 'ig');

        return text.replace(flagsExpression, ':flag-$&:');
    }
}

module.exports = SlackController;
