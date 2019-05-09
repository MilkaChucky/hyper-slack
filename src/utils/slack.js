const { DOMAIN_EMPTY, EMAIL_EMPTY, PASSWORD_EMPTY, TOKEN_REQUIRED,
    CHANNEL_NOT_SPECIFIED, MESSAGE_EMPTY, TOKEN_EMPTY, TOKEN_INVALID
} = require('../errorMessages');

const { WebClient } = require('@slack/web-api');
const client = new WebClient();

let channelsCache = [];
let usersCache = {};
let botsCache = {};

getChannels = async (token) => {
    const { channels } = await client.conversations.list({
        token: token,
        exclude_archived: true,
        types: 'public_channel,private_channel'
    });

    channelsCache = channels.map((channel) => {
        return {
            id: channel.id,
            name: channel.name
        }
    });
};

getUser = async (token, userId) => {
    const { profile } = await client.users.profile.get({
        token: token,
        user: userId
    });

    usersCache[userId] = {
        name: profile.display_name_normalized || profile.real_name_normalized,
        image: profile.image_48
    }
};

getBot = async  (token, botId) => {
    const { bot } = await client.bots.info({
        token: token,
        bot: botId
    });

    botsCache[botId] = {
        name: bot.name,
        image: bot.icons.image_48
    }
};

exports.requestToken = async (domain, email, password) => {
    if (!domain) throw new Error(DOMAIN_EMPTY);
    if (!email) throw new Error(EMAIL_EMPTY);
    if (!password) throw new Error(PASSWORD_EMPTY);

    const { team_id } = await client.apiCall('auth.findTeam', { domain: domain });
    const { token } = await client.apiCall('auth.signin', {
        email: email,
        password: password,
        team: team_id,
    });

    await Promise.all([
        getChannels(token)
    ]);

    return token;
};

exports.tokenIsValid = async (token) => {
    return await client.auth.test({ token: token })
        .then(response => {
            return { valid: response.ok }
        })
        .catch(error => {
            switch (error.data.error) {
                case 'not_authed':
                    return {
                        valid: false,
                        reason: TOKEN_EMPTY
                    };
                case 'invalid_auth':
                    return {
                        valid: false,
                        reason: TOKEN_INVALID
                    };
            }
        })
};

exports.postMessage = async (token, channel, text) => {
    if (!token) throw new Error(TOKEN_REQUIRED);
    if (!channel) throw new Error(CHANNEL_NOT_SPECIFIED);
    if (!text) throw new Error(MESSAGE_EMPTY);

    await client.chat.postMessage({
        token: token,
        channel: channel,
        text: text,
        as_user: true
    });
};

exports.getChannels = async (token, refreshCache = false) => {
    if (!token) throw new Error(TOKEN_REQUIRED);

    if (!(channelsCache && channelsCache.length) || refreshCache)
        await getChannels(token);

    return channelsCache;
};

exports.getChannelHistory = async (token, channel, messageCount = null) => {
    if (!token) throw new Error(TOKEN_REQUIRED);
    if (!channel) throw new Error(CHANNEL_NOT_SPECIFIED);

    return await client.channels.history({
        token: token,
        channel: channel,
        ...(isNaN(messageCount) || messageCount < 1 ? {} : { count: messageCount })
    }).then((response) =>
        response.messages.filter((message) => message.type === 'message')
    ).then(async (messages) =>
        await Promise.all(messages.map(async (message) => {
            if (message.user) {
                const userId = message.user;

                if (!usersCache[userId])
                    await getUser(token, userId);

                return {
                    getInfo: () => {
                        return usersCache[userId];
                    },
                    text: message.subtype === 'channel_join' ?
                        `${usersCache[userId].name} has joined the channel` :
                        message.text
                }
            } else if (message.bot_id) {
                const botId = message.bot_id;

                if (!botsCache[botId])
                    await getBot(token, botId);

                return {
                    getInfo: () => {
                        return botsCache[botId];
                    },
                    text: message.text
                }
            }
        }))
    );
};
