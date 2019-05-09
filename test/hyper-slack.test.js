import test from 'ava';
import React from 'react';

const {
    decorateTerm
} = require('../src/components/hyper-slack');

const {
    TARGET_NULL, TARGET_UNDEFINED
} = require('../src/errorMessages');

let slackComponent;

test.before(t => {
    const classUnderTest = decorateTerm(null, { React });
    slackComponent = new classUnderTest(null, null);
});

test( 'Test handleOnChange with valid parameter setting "email"', async t => {
    const email = "teszt@mail.com";

    Promise.resolve(slackComponent.handleOnChange({
        "target": {
            "id": slackComponent.emailNodeId,
            "value": email
        }
    }));

    t.is(slackComponent.email, email);
});

test('Test handleOnChange with valid parameter setting "pswd"', async t => {
    const pswd = "jelszo";

    Promise.resolve(slackComponent.handleOnChange({
        "target": {
            "id": slackComponent.pswdNodeId,
            "value": pswd
        }
    }));

    t.is(slackComponent.pswd, pswd);
});

test('Test handleOnChange with valid parameter setting "domain"', async t => {
    const domain = "nocommentdevelopment";

    Promise.resolve(slackComponent.handleOnChange({
        "target": {
            "id": slackComponent.domainNodeId,
            "value": domain
        }
    }));

    t.is(slackComponent.domain, domain);
});

test("Test handleOnChange with null id shouldn't change anything", async t => {
    const temp = "teszt";

    await Promise.resolve(slackComponent.handleOnChange({
        "target": {
            "id": null,
            "value": temp
        }
    }));

    t.not(slackComponent.email, temp);
    t.not(slackComponent.pswd, temp);
    t.not(slackComponent.domain, temp);
});

test("Test handleOnChange with non existing id shouldn't change anything", async t => {
    const temp = "teszt";

    await Promise.resolve(slackComponent.handleOnChange({
        "target": {
            "id": "nincs-ilyen-id",
            "value": temp
        }
    }));

    t.not(slackComponent.email, temp);
    t.not(slackComponent.pswd, temp);
    t.not(slackComponent.domain, temp);
});

test("Test handleOnChange with null value shouldn't change email", async t => {
    await Promise.resolve(slackComponent.handleOnChange({
        "target": {
            "id": slackComponent.emailNodeId,
            "value": null
        }
    }));

    t.not(slackComponent.email, null);
});

test("Test handleOnChange with null value shouldn't change pswd", async t => {
    await Promise.resolve(slackComponent.handleOnChange({
        "target": {
            "id": slackComponent.pswdNodeId,
            "value": null
        }
    }));

    t.not(slackComponent.pswd, null);
});

test("Test handleOnChange with null value shouldn't change domain", async t => {
    await Promise.resolve(slackComponent.handleOnChange({
        "target": {
            "id": slackComponent.domainNodeId,
            "value": null
        }
    }));

    t.not(slackComponent.domain, null);
});

test('Test handleOnChange with null parameters should fail', async t => {
    const error = await t.throws(() => { slackComponent.handleOnChange(null) });
    t.is(error.message, TARGET_NULL);
});

test('Test handleOnChange with undefined parameters should fail', async t => {
    const error = await t.throws(() => { slackComponent.handleOnChange(undefined) });
    t.is(error.message, TARGET_UNDEFINED);
});

test("Test handleOnChange without id and value shouldn't change anything", async t => {
    slackComponent.email = '';
    slackComponent.pswd = '';
    slackComponent.domain = '';

    const expected = '';

    await Promise.resolve(slackComponent.handleOnChange({
        "target": {
        }
    }));

    t.is(slackComponent.email, expected);
    t.is(slackComponent.pswd, expected);
    t.is(slackComponent.domain, expected);
});

test.serial("Test handleToggleSlackChat changes isChatWindowActive from false to true", t => {
	slackComponent.isChatWindowActive = false;
    slackComponent.handleToggleSlackChat()
	t.is(slackComponent.isChatWindowActive, true);
});

test.serial("Test handleToggleSlackChat changes isChatWindowActive from true to false", t => {
	slackComponent.isChatWindowActive = true;
    slackComponent.handleToggleSlackChat()
	t.is(slackComponent.isChatWindowActive, false);
});

test.serial("Test handleToggleSlackLogin changes isLoginWindowActive from false to true", t => {
	slackComponent.isLoginWindowActive = false;
    slackComponent.handleToggleSlackLogin()
	t.is(slackComponent.isLoginWindowActive, true);
});

test.serial("Test handleToggleSlackLogin changes isLoginWindowActive from true to false", t => {
	slackComponent.isLoginWindowActive = true;
    slackComponent.handleToggleSlackLogin()
	t.is(slackComponent.isLoginWindowActive, false);
});

test.serial("Test closeChatWindow sets isChatWindowActive to false when it was true", t => {
	slackComponent.closeChatWindow()
	t.is(slackComponent.isChatWindowActive, false);
});

test.serial("Test closeChatWindow sets isChatWindowActive to false when it was false", t => {
	slackComponent.closeChatWindow()
	t.is(slackComponent.isChatWindowActive, false);
});

