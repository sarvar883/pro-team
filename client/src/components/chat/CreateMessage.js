import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createMessage } from '../../actions/chatActions';

class CreateMessage extends Component {
  state = {
    content: ''
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();
    const object = {
      chatId: this.props.chat.currentChat._id,
      fromId: this.props.auth.user.id,
      fromName: this.props.auth.user.name,
      body: this.state.content
    };
    this.props.createMessage(object);
    document.getElementById('create-message-input').value = '';
    this.setState({ content: '' });
  };

  render() {
    return (
      <div className="create-message">
        <form onSubmit={this.onSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="create-message-input"
              placeholder="Type Message Here ..."
              name="content"
              required
              onChange={this.onChange}
            />
            <div className="input-group-append">
              <button type="submit" className="btn btn-success">Отправить</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

CreateMessage.propTypes = {
  createMessage: PropTypes.func.isRequired,
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

export default connect(mapStateToProps, { createMessage })(withRouter(CreateMessage));