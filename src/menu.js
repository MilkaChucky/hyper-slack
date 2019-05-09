const { LEAD_KEY } = require('./constants');

exports.decorateMenu = (menu) => {
    const slackMenu = {
        label: 'Slack',
        submenu: [
            {
              label: 'Login',
                accelerator: `${LEAD_KEY}+Alt+S`,
                click(item, focusedWindow) {
                    if (focusedWindow !== null) {
                        focusedWindow.rpc.emit('hyper-slack:toggle:login', { focusedWindow });
                    }
                },
            },
            {
                label: 'Logout',
                accelerator: `${LEAD_KEY}+Alt+C`,
                click(item, focusedWindow) {
                    if (focusedWindow !== null) {
                        focusedWindow.rpc.emit('hyper-slack:activate:logout', { focusedWindow });
                    }
                },
            },
            {
                label: 'Toggle Slack',
                accelerator: `${LEAD_KEY}+G`,
                click(item, focusedWindow) {
                    if (focusedWindow !== null) {
                        focusedWindow.rpc.emit('hyper-slack:toggle:slack', { focusedWindow });
                    }
                },
            },
            {
                label: 'Refresh',
                accelerator: `${LEAD_KEY}+Shift+G`,
                click(item, focusedWindow) {
                    if (focusedWindow !== null) {
                        focusedWindow.rpc.emit('hyper-slack:activate:refresh', { focusedWindow });
                    }
                },
            },
        ]
    };

    menu.push({type: 'separator'});
    menu.push(slackMenu);
    menu.push({type: 'separator'});

    return menu;
};
