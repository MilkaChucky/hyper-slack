const {
    wrapperStyle, inputStyle,
    chatWindowStyle, chatWindowHeaderStyle,
    chatWindowInputWrapperStyle, chatWindowCloseButtonStyle,
    chatWindowChannelSelectionButtonStyle, chatTextAreaStyle,
    chatWindowToggleButtonStyle, chatWindowChannelSelector
} = require('../componentStyles');

const {
    requestToken, postMessage, getChannelHistory, getChannels, tokenIsValid
} = require('../utils/slack');

exports.decorateTerm = (Term, {React}) => {
    return class HyperSlackTerm extends React.Component {
        constructor(props, context) {
            super(props, context);
            this.inputEmailNode = null;
            this.inputPasswordNode = null;
            this.inputDomainNode = null;
            this.channelSelectorNode = null;
            this.userTokenKey = "user_token";

            this.emailNodeId = "hyper-slack-login-email";
            this.email = '';
            this.pswdNodeId = "hyper-slack-login-password";
            this.pswd = '';
            this.domainNodeId = "hyper-slack-login-domain";
            this.domain = '';
            this.textInputNodeId = "hyper-chat-window-input";
            this.state = {
                messages: [],
                textInput: '',
                channels: []
            };
            this.selectableChannels = [];

            this.selectedChannel = "#chat_ablak";

            this.isChatWindowActive = false;
            this.isLoginWindowActive = false;
            this.isChannelSelectorActive = false;

            this.closeChatWindow = this.closeChatWindow.bind(this);
            this.handleToggleSlackChat = this.handleToggleSlackChat.bind(this);
            this.handleToggleSlackLogin = this.handleToggleSlackLogin.bind(this);
            this.handleRefresh = this.handleRefresh.bind(this);
            this.handleLogout = this.handleLogout.bind(this);

            this.handleOnChange = this.handleOnChange.bind(this);
            this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
            this.openChannelSelector = this.openChannelSelector.bind(this);

            this.unsetSession(this.userTokenKey);
        }

        componentDidMount() {
            window.rpc.on('hyper-slack:toggle:slack', this.handleToggleSlackChat);
            window.rpc.on('hyper-slack:toggle:login', this.handleToggleSlackLogin);
            window.rpc.on('hyper-slack:activate:refresh', this.handleRefresh);
            window.rpc.on('hyper-slack:activate:logout', this.handleLogout);
        }

        componentWillUnmount() {
            window.rpc.removeListener('hyper-slack:toggle:slack', this.handleToggleSlackChat);
            window.rpc.removeListener('hyper-slack:toggle:login', this.handleToggleSlackLogin);
            window.rpc.removeListener('hyper-slack:activate:refresh', this.handleRefresh);
            window.rpc.removeListener('hyper-slack:activate:logout', this.handleLogout);
        }

        handleToggleSlackChat() {
            this.isChatWindowActive = !this.isChatWindowActive;
            this.forceUpdate();
        }

        handleToggleSlackLogin() {
            this.isLoginWindowActive = !this.isLoginWindowActive;
            this.forceUpdate();
        }

        handleRefresh() {
            this.forceUpdate();
        }

        handleLogout() {
            this.closeChatWindow();
            this.unsetSession(this.userTokenKey);
            this.forceUpdate();
        }

        handleOnChange(event) {
            if (!event.target.id) {
                return;
            }
            const target = event.target.id;
            const value = event.target.value;
            switch (target) {
                case this.emailNodeId: {
                    this.email = value;
                    break;
                }
                case this.pswdNodeId: {
                    this.pswd = value;
                    break;
                }
                case this.domainNodeId: {
                    this.domain = value;
                    break;
                }
                case this.textInputNodeId: {
                    this.setState({ textInput: value });
                    break;
                }
                default:
                    break;
            }
        }

        handleOnKeyDown(event) {
            if (event.key === "Enter") {
                requestToken(this.domain, this.email, this.pswd)
                    .then(token => {
                        if(token) {
                            this.setSession(token);
                            this.handleToggleSlackLogin();
                            this.getChannelsForSelect();                                                      
                        }                        
                    });
            }
        }

        toggleLoginWindow() {
            return this.isLoginWindowActive;
        }

        toggleChatWindow() {
            return this.isChatWindowActive;
        }

        toggleChannelSelector() {            
            return this.isChannelSelectorActive;
        }

        openChannelSelector() {
            tokenIsValid(this.getSession()).then(is => {
                if (is.valid) {
                    this.isChannelSelectorActive = true;
                    this.forceUpdate();
                }
            });
        }

        closeChatWindow() {
            this.isChatWindowActive = false;
            this.isChannelSelectorActive = false;
            this.forceUpdate();
        }

        setSession(token, key = this.userTokenKey) {
            window.sessionStorage.setItem(key, token);
            return window.sessionStorage.getItem(key);
        }

        unsetSession(key, checkTokenValue) {
            if (checkTokenValue) {
                if (checkTokenValue == window.sessionStorage.getItem(key)) {
                    window.sessionStorage.removeItem(key);
                    return true;
                }
                return false;
            }
            window.sessionStorage.removeItem(key);
            return true;
        }

        getSession(key = this.userTokenKey) {
            return window.sessionStorage.getItem(key);
        }

        async sendMessage() {
            if (!this.state.textInput)
                return;

            try {
                await postMessage(this.getSession(this.userTokenKey), this.selectedChannel, this.state.textInput);
                this.setState({textInput: ''});
            } catch (error) {
                console.log(error);
            }
        }

        async handleSelectClick(event) {
            try {
                this.isChannelSelectorActive = false;
                this.forceUpdate();
                this.selectedChannel = event.target.value;
                const token = this.getSession(this.userTokenKey);
                const messages = await getChannelHistory(token, this.selectedChannel, 20);
                this.setState({messages: messages});
            } catch (error) {
                console.log(error);
            }
        }

        async getChannelsForSelect() {
            try {
                const token = this.getSession(this.userTokenKey);
                const ch = await getChannels(token);
                this.setState({channels: ch});
            } catch (error) {
                console.log(error);
            }
        }

        onSelectClickHandler(event) {
            this.forceUpdate();
        }

        render() {
            const style = Object.assign({}, this.props.style || {}, {height: "100%"});

            return React.createElement("div", {style},
                this.toggleLoginWindow() && !this.toggleChatWindow() &&
                React.createElement("div", {
                        className: "hyper-slack-login-wrapper",
                        style: wrapperStyle(this.props)
                    },
                    React.createElement("input", {
                        id: "hyper-slack-login-domain",
                        autoFocus: true,
                        onChange: this.handleOnChange,
                        onKeyDown: this.handleOnKeyDown,
                        placeholder: "Workspace",
                        ref: (node) => {
                            this.inputDomainNode = node;
                        },
                        style: inputStyle(this.props)
                    }),
                    React.createElement("input", {
                        id: "hyper-slack-login-email",
                        onChange: this.handleOnChange,
                        onKeyDown: this.handleOnKeyDown,
                        placeholder: "E-mail",
                        ref: (node) => {
                            this.inputEmailNode = node;
                        },
                        style: inputStyle(this.props)
                    }),
                    React.createElement("input", {
                        id: "hyper-slack-login-password",
                        type: "password",
                        onChange: this.handleOnChange,
                        onKeyDown: this.handleOnKeyDown,
                        placeholder: "Password",
                        ref: (node) => {
                            this.inputPasswordNode = node;
                        },
                        style: inputStyle(this.props)
                    })
                ),
                !this.toggleLoginWindow() && !this.toggleChatWindow() &&
                React.createElement("img", {
                    className: "hyper-chat-window-toggle-button",
                    style: chatWindowToggleButtonStyle(this.props),
                    onClick: () => {
                        if (this.getSession())
                            this.handleToggleSlackChat();
                        else
                            this.handleToggleSlackLogin();
                    },
                    src: 'https://i.imgur.com/yf0CiCV.png'
                }),
                this.toggleChatWindow() && !this.toggleLoginWindow() &&
                React.createElement("div", {
                        className: "hyper-chat-window",
                        style: chatWindowStyle(this.props)
                    },
                    this.toggleChannelSelector() && React.createElement("select", {
                        id: "channel-selector",
                        onClick: this.onSelectClickHandler.bind(this),
                        style: chatWindowChannelSelector(this.props),
                        onChange: this.handleSelectClick.bind(this)
                    },
                        this.state.channels.map((channels, i) => {
                            const { id, name } = channels;
                            return React.createElement("option", {value: id}, name);
                        })
                    ),
                    React.createElement("div", {
                            className: "hyper-chat-window-inner",
                            style: chatWindowHeaderStyle(this.props)
                        },
                        React.createElement("button", {
                            className: "hyper-chat-window-close-button",
                            style: chatWindowCloseButtonStyle(this.props),
                            onClick: this.closeChatWindow
                        }, 'X'),
                        React.createElement("img", {
                            className: "hyper-chat-window-channel-selection",
                            style: chatWindowChannelSelectionButtonStyle(this.props),
                            src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXz6GZDpLo6X5b7ty11mELFc02Re5-75NQ-jpRWxV2h9PjSu_E',
                            onClick: this.openChannelSelector
                        })
                    ),
                    React.createElement("ul", {
                            className: "hyper-chat-window-chat",
                            style: chatTextAreaStyle(this.props)
                        },
                        this.state.messages.map((message, i) => {
                            const { name, image } = message.getInfo();
                            return React.createElement("li", { key: i },
                                React.createElement("img", {
                                    src: image,
                                    style: {
                                        width: '16px',
                                        height: '16px',
                                        margin: '4px'
                                    }
                                }),
                                React.createElement("span", {
                                    style: { verticalAlign: 'center' }
                                }, `${name}: ${message.text}`)
                            );
                        })
                    ),
                    React.createElement("div", {
                            className: "hyper-chat-window-input-wrapper",
                            style: chatWindowInputWrapperStyle(this.props)
                        },
                        React.createElement("textarea", {
                            id: "hyper-chat-window-input",
                            autoFocus: true,
                            style: inputStyle(this.props),
                            value: this.state.textInput,
                            onChange: this.handleOnChange,
                            onKeyUp: async (event) => {
                                if (event.key === 'Enter')
                                    await this.sendMessage();
                            }
                        })
                    ),
                ),
                React.createElement(Term, this.props)
            );
        }
    };
};
