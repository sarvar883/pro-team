import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllUsers, createChat, getAllChatsOfUser } from '../../actions/chatActions';

// socket.io
import openSocket from 'socket.io-client';
import socketLink from '../common/socketLink';

class DisplayUsersWithChat extends Component {
  _isMounted = false;

  state = {
    hasChatWith: this.props.chat.hasChatWith,
    myChats: this.props.chat.chats
  };

  componentDidMount() {
    this._isMounted = true;

    // const socket = openSocket('http://localhost:5000');
    // const socket = openSocket('https://fierce-scrubland-41952.herokuapp.com');
    const socket = openSocket(socketLink);

    socket.on('createChat', data => {
      const userId = this.props.auth.user.id;
      if (userId === data.user1._id.toString() || userId === data.user2._id.toString()) {
        let newChat = data.chat;
        newChat.user1 = data.user1;
        newChat.user2 = data.user2;
        this.addChatToDOM(newChat);
      }
    })
  }

  // ANOTHER WAY TO DYNAMICALLY ADD NEW CHAT TO DOM WITHOUT RELOADING
  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     myChats: nextProps.chat.chats
  //   })
  // }

  addChatToDOM = (chat) => {
    if (this._isMounted) {
      this.setState(prevState => {
        const updatedObject = [...prevState.myChats];
        updatedObject.push(chat);
        return {
          myChats: updatedObject
        };
      });
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let tableBody = this.state.myChats.map((chat, index) =>
      <tr key={index}>
        {chat.user1._id.toString() === this.props.auth.user.id ? (
          <React.Fragment>
            <td>{chat.user2.name}</td>
            <td>{chat.user2.occupation}</td>
          </React.Fragment>
        ) : (
            <React.Fragment>
              <td>{chat.user1.name}</td>
              <td>{chat.user1.occupation}</td>
            </React.Fragment>
          )}

        <td>
          <Link to={'/chat/' + chat._id} className="btn btn-primary">Перейти К Чату</Link>
        </td>
      </tr>
    )

    return (
      <React.Fragment>
        <table className="table table-striped table-hover table-bordered">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Должность</th>
              <th>Открыть Чат</th>
            </tr>
          </thead>
          <tbody>
            {tableBody}
          </tbody>
        </table>
      </React.Fragment>
    )
  }
}

DisplayUsersWithChat.propTypes = {
  getAllUsers: PropTypes.func.isRequired,
  createChat: PropTypes.func.isRequired,
  getAllChatsOfUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  chat: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  chat: state.chat,
  errors: state.errors
});

export default connect(mapStateToProps, { getAllUsers, createChat, getAllChatsOfUser })(withRouter(DisplayUsersWithChat));