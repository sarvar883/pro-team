import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import spinner from './spinner.gif';
import whiteSpinner from './white-spinner.gif';

class Spinner extends Component {
  render() {
    return (
      <div className="spinner">
        {this.props.options.theme === 'dark' ? (
          <img
            src={whiteSpinner}
            alt="Loading..."
            className="mt-4"
            style={{ width: '100px', margin: 'auto', display: 'block' }} />
        ) : (
            <img
              src={spinner}
              alt="Loading..."
              style={{ width: '220px', margin: 'auto', display: 'block' }} />
          )}
      </div>
    )
  }
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  options: state.options,
  errors: state.errors
});

export default connect(mapStateToProps)(withRouter(Spinner));