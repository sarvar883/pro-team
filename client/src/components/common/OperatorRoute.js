import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const OperatorRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (auth.isAuthenticated === false) {
        return <Redirect to="/login" />
      }
      if (auth.user.occupation === 'operator' || auth.user.occupation === 'subadmin' || auth.user.occupation === 'admin') {
        return <Component {...props} />
      } else {
        return <Redirect to={`/${auth.user.occupation}`} />
      }
    }}
  />
);

OperatorRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(OperatorRoute);