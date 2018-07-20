/* eslint-disable key-spacing */
const { describe, it } = require('mocha');
const { expect } = require('chai');
const SlackController = require('../slack-controller');

describe('SlackController', () => {
    describe('constructor', () => {
        it('should set the authToken', () => {
            const authToken = 'auth token headerValue';
            const slackController = new SlackController(authToken);

            expect(slackController.authToken).to.equal(authToken);
        });
    });

    describe('handleCommand', () => {
        it('should send a message to slack with json content type', () => {
            const request = {
                body: {
                    channel_id: '',
                    text      : '',
                    user_name : '',
                },
            };

            const expectedHeader = 'Content-Type';
            const expectedHeaderValue = 'application/json';

            const response = {
                set : (header, headerValue) => {
                    response.header = header;
                    response.headerValue = headerValue;
                },
                send: () => {
                },
            };

            const slackController = new SlackController({});
            slackController.sendFlagifiedMessage = () => {
            };

            slackController.handleCommand(request, response);

            expect(expectedHeader).to.be.equal(response.header);
            expect(expectedHeaderValue).to.be.equal(response.headerValue);
        });

        it('should send a flagified message to slack');

        it('should send an empty message to slack', () => {
            const request = {
                body: {
                    channel_id: '',
                    text      : '',
                    user_name : '',
                },
            };

            const expectedMessage = '';

            const response = {
                set : () => {
                },
                send: (message) => {
                    response.message = message;
                },
            };

            const slackController = new SlackController({});
            slackController.sendFlagifiedMessage = () => {
            };

            slackController.handleCommand(request, response);

            expect(expectedMessage).to.be.equal(response.message);
        });
    });
});
