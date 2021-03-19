import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllUsers, createChat, getAllChatsOfUser } from '../../actions/chatActions';

// socket.io
import openSocket from 'socket.io-client';
import socketLink from '../common/socketLink';

class DisplayUsersWithoutChat extends Component {
  _isMounted = false;

  state = {
    notHaveChatWith: this.props.chat.notHaveChatWith.filter(user => user._id !== this.props.auth.user.id)
  };

  componentDidMount() {
    this._isMounted = true;

    // const socket = openSocket('http://localhost:5000');
    // const socket = openSocket('https://fierce-scrubland-41952.herokuapp.com');
    const socket = openSocket(socketLink);

    socket.on('createChat', data => {
      if (this.props.auth.user.id === data.user1._id.toString()) {
        this.removeUserFromDOM(data.user2);
      }
      if (this.props.auth.user.id === data.user2._id.toString()) {
        this.removeUserFromDOM(data.user1);
      }
    })
  }

  removeUserFromDOM = (user) => {
    if (this._isMounted) {
      this.setState(prevState => {
        const updatedObject = [...prevState.notHaveChatWith];
        return {
          notHaveChatWith: updatedObject.filter(item => item._id !== user._id.toString())
        };
      });
    }
  };

  onSubmit = (e) => {
    e.preventDefault();

    // creating new chat
    const object = {
      user1: this.props.auth.user.id,
      user2: e.target.children[0].defaultValue // access input hidden
    };

    this.props.createChat(object, this.props.history);
  };

  componentWillUnmount() {
    this._isMounted = false;
  };

  render() {
    let tableBody = this.state.notHaveChatWith.map((user, index) =>
      <tr key={index}>
        <td>{user.name}</td>
        <td>{user.occupation}</td>
        <td>
          <form onSubmit={this.onSubmit}>
            <input type="hidden" name="userId" value={user._id} />
            <button type="submit" className="btn btn-success">Создать Чат</button>
          </form>
        </td>
      </tr>
    )

    return (
      <React.Fragment>
        {this.state.notHaveChatWith.length > 0 ? (
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Должность</th>
                <th>Создать Чат</th>
              </tr>
            </thead>
            <tbody>
              {tableBody}
            </tbody>
          </table>
        ) : (
            <h2>У вас есть чаты со всеми юзерами</h2>
          )}
      </React.Fragment>
    )
  }
}

DisplayUsersWithoutChat.propTypes = {
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

export default connect(mapStateToProps, { getAllUsers, createChat, getAllChatsOfUser })(withRouter(DisplayUsersWithoutChat));