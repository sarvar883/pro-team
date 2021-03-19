import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

// socket.io
import openSocket from 'socket.io-client';
import socketLink from '../common/socketLink';

class ShowAnons extends Component {
  _isMounted = false;

  state = {
    anons: this.props.chat.anons
  };

  componentDidMount() {
    this._isMounted = true;

    // const socket = openSocket('http://localhost:5000');
    // const socket = openSocket('https://fierce-scrubland-41952.herokuapp.com');
    const socket = openSocket(socketLink);

    socket.on('createAnons', data => {
      this.addAnonsToDOM(data.anons);
    });
  };

  addAnonsToDOM = (anons) => {
    if (this._isMounted) {
      this.setState(prevState => {
        const updatedAnons = [...prevState.anons];
        updatedAnons.push(anons);
        return {
          anons: updatedAnons
        };
      });
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
  };

  render() {
    let anons = this.state.anons.map((item, index) =>
      <div className="anons mt-2" key={index}>
        <div className="anons-author">
          <p className="mb-0">{item.adminId.name}</p>
        </div>
        <div className="anons-content">
          <p className="mb-0">{item.body}</p>
        </div>
        <div className="anons-date">
          <p className="mb-0">{moment(item.writtenAt).calendar()}</p>
        </div>
      </div>
    );

    return (
      <React.Fragment>
        <div className="row">
          <h2 className="m-auto">Объявления Админа</h2>
        </div>

        <div className="row announcements mt-2">
          <div className="col-md-8 m-auto">
            {anons}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

ShowAnons.propTypes = {
  auth: PropTypes.object.isRequired,
  chat: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  chat: state.chat,
  errors: state.errors
});

export default connect(mapStateToProps)(withRouter(ShowAnons));