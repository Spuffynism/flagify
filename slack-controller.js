const https = require('https');

/**
 * Slack Controller
 *
 * Handles request made from slack.
 */
class SlackController {
    /**
     * @param authToken authentication token
     */
    constructor(authToken) {
        this.authToken = authToken;
    }

    /**
     * Handles slash command requests
     *
     * @param req an http request from slack
     * @param res an http response to slack
     */
    handleCommand(req, res) {
        this.sendFlagifiedMessage(
            req.body.channel_id,
            req.body.text,
            req.body.user_name,
        );

        res.set('Content-Type', 'application/json');
        res.send(''); // slack needs an immediate reception confirmation
    }

    /**
     * Sends a flagified text message to a channel from a user.
     *
     * @param channelId the channel to send the message to
     * @param text the text to flagify
     * @param username the emulated user's username
     */
    sendFlagifiedMessage(channelId, text, username) {
        const body = SlackController.buildRequestBody(
            channelId,
            text,
            username,
        );

        const request = this.buildRequest(body);

        request.write(body);
        request.end();
    }

    /**
     * Builds the request body.
     *
     * @param channelId the channel to send the message to
     * @param text the text to flagify
     * @param username the emulated user's username
     *
     * @returns {string} the stringified request body
     */
    static buildRequestBody(channelId, text, username) {
        return JSON.stringify({
            channel: channelId,
            response_type: 'ephemeral',
            text: SlackController.replaceTextWithFlags(text),
            as_user: username,
        });
    }

    /**
     * Replaces the text with flags when possible.
     *
     * @param text the text to replace
     * @returns {string} the flagified text
     */
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

    /**
     * Builds the http request.
     *
     * @param body the request's body
     * @returns {*}
     */
    buildRequest(body) {
        const bodyLength = Buffer.byteLength(body);
        const options = this.buildRequestOptions(bodyLength);

        return https.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                // eslint-disable-next-line no-console
                console.log(`response: ${chunk}`);
            });
        });
    }

    /**
     * Build
     * @param bodyLength the request's body length
     * @returns {object} the request options
     */
    buildRequestOptions(bodyLength) {
        return {
            hostname: 'slack.com',
            path: '/api/chat.postMessage',
            method: 'POST',
            port: 443,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': bodyLength,
                Authorization: `Bearer ${this.authToken}`,
            },
        };
    }
}

module.exports = SlackController;
