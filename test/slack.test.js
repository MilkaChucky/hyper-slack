import test from 'ava';

const {
    requestToken,
    getChannels,
    getChannelHistory,
    postMessage,
    tokenIsValid
} = require('../src/utils/slack');

const { DOMAIN_EMPTY, EMAIL_EMPTY, PASSWORD_EMPTY, TOKEN_REQUIRED,
    CHANNEL_NOT_SPECIFIED, MESSAGE_EMPTY, TOKEN_EMPTY, TOKEN_INVALID
} = require('../src/errorMessages');

test('Empty domain throws error when requesting token', async t => {
    await t.throwsAsync(requestToken(null, 'test', 'test'), {
        message: DOMAIN_EMPTY
    });
});

test('Empty email throws error when requesting token', async t => {
    await t.throwsAsync(requestToken('test', null, 'test'), {
        message: EMAIL_EMPTY
    });
});

test('Empty password throws error when requesting token', async t => {
    await t.throwsAsync(requestToken('test', 'test', null), {
        message: PASSWORD_EMPTY
    });
});

test('Token validation finds empty token invalid', async t => {
    const { valid, reason } = await tokenIsValid(null);
    t.true(valid === false && reason === TOKEN_EMPTY);
});

test('Token validation finds not existing token invalid', async t => {
    const { valid, reason } = await tokenIsValid('test');
    t.true(valid === false && reason === TOKEN_INVALID);
});

test('Sending message without specifying token throws error', async t => {
    await t.throwsAsync(postMessage(null, 'test', 'test'), {
        message: TOKEN_REQUIRED
    });
});

test('Sending message without specifying channel throws error', async t => {
    await t.throwsAsync(postMessage('test', null, 'test'), {
        message: CHANNEL_NOT_SPECIFIED
    });
});

test('Sending message with empty message text throws error', async t => {
    await t.throwsAsync(postMessage('test', 'test', null), {
        message: MESSAGE_EMPTY
    });
});

test('Listing channels without specifying token throws error', async t => {
    await t.throwsAsync(getChannels(null), {
        message: TOKEN_REQUIRED
    });
});

test('Listing channel history without specifying token throws error', async t => {
    await t.throwsAsync(getChannelHistory(null, 'test'), {
        message: TOKEN_REQUIRED
    });
});

test('Listing channel history without specifying channel throws error', async t => {
    await t.throwsAsync(getChannelHistory('test', null), {
        message: CHANNEL_NOT_SPECIFIED
    });
});
