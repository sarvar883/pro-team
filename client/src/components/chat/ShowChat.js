import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentChat, editMessage, deleteMessage } from '../../actions/chatActions';
import moment from 'moment';

import CreateMessage from './CreateMessage';

// socket.io
import openSocket from 'socket.io-client';
import socketLink from '../common/socketLink';

class ShowChat extends Component {
  _isMounted = false;

  state = {
    messages: this.props.chat.currentChat.messages,
    showEdit: false,
    editmessageid: '',
    editmessagebody: ''
  };

  componentDidMount() {
    this._isMounted = true;

    // scroll down
    window.scrollTo(0, document.getElementById('row-with-messages').scrollHeight);
    document.getElementById('navbar').classList.add('fixed-top');

    // const socket = openSocket('http://localhost:5000');
    // const socket = openSocket('https://fierce-scrubland-41952.herokuapp.com');
    const socket = openSocket(socketLink);

    socket.on(`createMessageInChat${this.props.match.params.chatId}`, data => {
      this.addMessageToDOM(data.message);
    });

    socket.on(`editMessageInChat${this.props.match.params.chatId}`, data => {
      this.updateDOMOnEditMessage(data.messageId, data.updatedBody);
    });

    socket.on(`deleteMessageInChat${this.props.match.params.chatId}`, data => {
      this.deleteMessageFromDOM(data.messageId);
    });
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  deleteClick = (e) => {
    const chatId = this.props.match.params.chatId;
    const messageId = e.target.value;
    this.props.deleteMessage(chatId, messageId);
  };

  editClick = (itemId, itemBody, e) => {
    if (this._isMounted) {
      return this.setState({
        showEdit: !this.state.showEdit,
        editmessageid: itemId,
        editmessagebody: itemBody,
      });
    }
  };

  onEditMessage = (e) => {
    e.preventDefault();
    const object = {
      chatId: this.props.match.params.chatId,
      messageId: this.state.editmessageid,
      updatedBody: this.state.editmessagebody
    };
    this.props.editMessage(object);
    if (this._isMounted) {
      this.setState({
        showEdit: !this.state.showEdit,
        editmessageid: '',
        editmessagebody: '',
      });
    }
  };

  updateDOMOnEditMessage = (messageId, updatedBody) => {
    if (this._isMounted) {
      const messagesinState = [...this.state.messages];
      for (let i = 0; i < messagesinState.length; i++) {
        if (messagesinState[i]._id.toString() === messageId) {
          messagesinState[i].body = updatedBody;
        }
      }
      this.setState({
        messages: messagesinState
      });
    }
  };

  addMessageToDOM = (message) => {
    if (this._isMounted) {
      this.setState(prevState => {
        let updatedMessages = [...prevState.messages];
        updatedMessages.push(message);
        return {
          messages: updatedMessages
        };
      });
      // scroll down
      window.scrollTo(0, document.getElementById('container-messages').scrollHeight);
    }
  };

  deleteMessageFromDOM = (messageId) => {
    if (this._isMounted) {
      this.setState(prevState => {
        let updatedMessages = [...prevState.messages]
        let array2 = updatedMessages.filter(message => message._id !== messageId);
        return {
          messages: array2
        };
      });
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
    document.getElementById('navbar').classList.remove("fixed-top");
  };

  render() {
    const { currentChat } = this.props.chat;
    const myId = this.props.auth.user.id;

    let messages = this.state.messages.map((item, index) =>
      <div className={item.fromId === myId ? 'my-message col-lg-6 col-md-8 col-10 ml-auto' : 'his-message col-lg-6 col-md-8 col-10'} key={index}>
        <div className="message-author">
          <p className="mb-0">{item.fromName}</p>
          {item.fromId === myId ? (
            <React.Fragment>
              <button
                className="btn btn-danger btn-sm pt-0 pb-0 ml-1 delete-message"
                onClick={this.deleteClick}
                value={item._id}
              >Delete</button>

              <button
                className="btn btn-dark btn-sm pt-0 pb-0 edit-message"
                onClick={this.editClick.bind(this, item._id, item.body)}
              >Edit</button>
            </React.Fragment>
          ) : null}
        </div>
        <div className="message-content">
          <p className="mb-0">{item.body}</p>
        </div>
        <div className="message-date">
          <p className="mb-0">{moment(item.writtenAt).calendar()}</p>
        </div>
      </div>
    );

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-12">
            <h2 className="text-center">Чат между {currentChat.user1.name} и {currentChat.user2.name}</h2>
          </div>
        </div>

        <div className="row" id="row-with-messages">
          <div className="col-12">
            {messages}
          </div>
        </div>

        <div className="container-fluid message-form">
          <div className="container pl-0 pr-0 mt-2 mb-3">
            {this.state.showEdit ? (

              <div className="edit-message">
                <form onSubmit={this.onEditMessage}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="edit-message-input"
                      name="editmessagebody"
                      placeholder="Type Message Here ..."
                      defaultValue={this.state.editmessagebody}
                      required
                      onChange={this.onChange}
                    />
                    <div className="input-group-append">
                      <button type="submit" className="btn btn-warning">Edit</button>
                    </div>
                  </div>
                </form>
              </div>
            ) : <CreateMessage />}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

ShowChat.propTypes = {
  deleteMessage: PropTypes.func.isRequired,
  getCurrentChat: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired,
  chat: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  chat: state.chat,
  errors: state.errors
});

export default connect(mapStateToProps, { getCurrentChat, editMessage, deleteMessage })(withRouter(ShowChat));