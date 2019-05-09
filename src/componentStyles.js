exports.wrapperStyle = (props) => {
    return {
        background: props.backgroundColor,
        borderRadius: '10px',
        border: `1px solid ${props.foregroundColor}`,
        height: '80px',
        padding: "5px 0 5px 10px",
        position: 'absolute',
        right: '10px',
        top: '5px',
        width: '300px',
        zIndex: '9998',
    };
};

exports.chatWindowStyle = (props) => {
    return {
        background: "gray",
        borderRadius: '10px',
        color: "white",
        border: `1px solid white`,
        height: '80%',
        width: '35%',
        padding: "0%",
        position: 'absolute',
        right: '20px',
        top: '5px',
        display: 'grid',
        gridTemplateRows: '30px 80% auto',
        zIndex: '9998',
    };
};

exports.chatWindowHeaderStyle = (props) => {
    return {
        background: "darkgray",
        borderRadius: '10px',
        color: "white",
        border: `1px solid white`,
        width: '100%',
        padding: '1%',     
        zIndex: '9998',
    };
};

exports.chatWindowInputWrapperStyle = (props) => {
    return {
        background: props.backgroundColor,
        borderRadius: '10px',
        border: `1px solid ${props.foregroundColor}`,
        padding: "1%",
        width: '100%',
        zIndex: '9998'
    };
};

exports.inputStyle = (props) => {
    return {
        background: "none",
        border: "none",
        width: '100%',
        color:/* props.foregroundColor*/ 'ghostwhite',
        fontColor: 'ghostwhite',
        fontSize: '1.2em',
        outline: "none",
        resize: 'none'
    };
};

exports.chatWindowCloseButtonStyle = (props) => {
    return {
      background: props.foregroundColor,
      border: '1px white solid',
      borderRadius: '30px',
      color: props.backgroundColor,
      height: '20px',
      width: '20px',
      outline: 'none',
      position: 'absolute',
      top: '5px',
      right: '5px'
    }
};

exports.chatWindowToggleButtonStyle = (props) => {
    return {
        background: "yellow",
        color: "red",
        border: '0.05% white solid',
        borderRadius: '30px',
        height: '32px',
        width: '32px',
        outline: 'none',
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: '9999'
    }
};

  exports.chatWindowChannelSelectionButtonStyle = (props) => {
    return {
      background: "ghostwhite",
      border: '1px white solid',
      //borderRadius: '30px',
      color: "red",
      height: '20px',
      width: '20px',
      outline: 'none',
      position: 'absolute',
      top: '5px',
      right: '45px'
    }
  };

exports.chatTextAreaStyle = (props) => {
    return {
        background: "rgba(75, 0, 130, 1)",
        borderRadius: '10px',
        border: `1px solid ${props.foregroundColor}`,
        margin: "0 1% 0 1%",
        width: '98%',
        zIndex: '9998',
        resize: 'none',
        overflow: 'auto'
    };
};

exports.chatWindowChannelSelector = (props) => {
    return {
        zIndex: '9999',
    };
};
