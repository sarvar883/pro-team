import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class Footer extends Component {
  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <div className="footer bg-light">
        <button className="btn btn-primary btn-block" onClick={this.goBack}>Назад</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {})(withRouter(Footer));