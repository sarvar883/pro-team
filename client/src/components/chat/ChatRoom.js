import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentChat, deleteMessage } from '../../actions/chatActions';
import Spinner from '../common/Spinner';

import ShowChat from './ShowChat';

class ChatRoom extends Component {
  componentDidMount() {
    this.props.getCurrentChat(this.props.match.params.chatId);
  }

  render() {
    const { loadingCurrentChat } = this.props.chat;
    return (
      <div className="container-fluid" id="container-messages">
        {loadingCurrentChat ? <Spinner /> : (
          <ShowChat />
        )}
      </div>
    )
  }
}

ChatRoom.propTypes = {
  deleteMessage: PropTypes.func.isRequired,
  getCurrentChat: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired,
  chat: PropTypes.object.isRequired
  // errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  chat: state.chat,
  errors: state.errors
});

export default connect(mapStateToProps, { getCurrentChat, deleteMessage })(withRouter(ChatRoom));