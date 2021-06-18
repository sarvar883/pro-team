import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class Footer extends Component {
  goBack = () => {
    this.props.history.goBack();
  };

  scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  render() {
    return (
      <div className="footer bg-light">
        <div className="row">
          <div className="col-md-8 col-sm-7 col-6 p-0">
            <button
              className="btn btn-primary btn-block"
              onClick={this.goBack}
            >
              <i className="fas fa-arrow-circle-left"></i> Назад
            </button>
          </div>

          <div className="col-md-4 col-sm-5 col-6 p-0">
            <button
              className="btn btn-warning btn-block ml-2"
              onClick={this.scrollTop}
            >
              <i className="fas fa-arrow-circle-up"></i> Наверх
            </button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {})(withRouter(Footer));