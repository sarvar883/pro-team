import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllUsers, getAllChatsOfUser } from '../../actions/chatActions';
import Spinner from '../common/Spinner';

import DisplayUsersWithoutChat from './DisplayUsersWithoutChat';
import DisplayUsersWithChat from './DisplayUsersWithChat';

class Chat extends Component {
  componentDidMount() {
    this.props.getAllChatsOfUser(this.props.auth.user.id);
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          {this.props.chat.loadingChats ? <Spinner /> : (
            <React.Fragment>
              <h2 className=" text-center mt-3">Создать Чат</h2>
              <div className="row">
                <DisplayUsersWithoutChat />
              </div>

              <h2 className="text-center mt-4">Ваши имеющиеся чаты</h2>
              <div className="row">
                <DisplayUsersWithChat />
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    )
  }
}

Chat.propTypes = {
  getAllUsers: PropTypes.func.isRequired,
  getAllChatsOfUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  chat: PropTypes.object.isRequired
  // errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  chat: state.chat,
  errors: state.errors
});

export default connect(mapStateToProps, { getAllUsers, getAllChatsOfUser })(withRouter(Chat));