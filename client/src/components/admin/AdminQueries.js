import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';

import { getQueriesForAdmin } from '../../actions/adminActions';

import ShowQueriesForAdmin from './ShowQueriesForAdmin';

class AdminQueries extends Component {
  componentDidMount() {
    if (!this.props.admin.orderQueries || this.props.admin.orderQueries.length === 0) {
      this.props.getQueriesForAdmin();
    }
  }

  render() {
    return (
      <div className="container-fluid">
        {this.props.admin.loadingOrderQueries ? <Spinner /> : <ShowQueriesForAdmin />}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  admin: state.admin,
  errors: state.errors
});

export default connect(mapStateToProps, { getQueriesForAdmin })(withRouter(AdminQueries));