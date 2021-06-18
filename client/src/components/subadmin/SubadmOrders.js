import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';

import removeZeros from '../../utils/removeZerosMat';
import { getSubadmOrders } from '../../actions/subadminActions';
import { getDisinfectorMaterials } from '../../actions/disinfectorActions';

import ShowOrderInfo from './ShowOrderInfo';

class SubadmOrders extends Component {
  state = {
    orders: []
  };

  componentDidMount() {
    this.props.getDisinfectorMaterials(this.props.auth.user.id);
    this.props.getSubadmOrders(this.props.auth.user.id);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.subadmin.myOrders) {
      this.setState({
        orders: nextProps.subadmin.myOrders
      });
    }
  };

  render() {
    const orders = this.state.orders.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

    let displayOrder = orders.map((item, index) =>
      <ShowOrderInfo orderObject={item} index={index} key={index} />
    );

    let currentMaterials = removeZeros(this.props.auth.user.materials).map((item, index) =>
      <li key={index}>{item.material}: {item.amount.toLocaleString()} {item.unit}</li>
    );

    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-12 mt-2">
              <h2 className="text-center">Страница Субaдмина {this.props.auth.user.name}</h2>
            </div>
          </div>

          {this.props.auth.loadingUser ? <Spinner /> : (
            <div className="row">
              <div className="col-12">
                <h3 className="text-center">Ваши имеющиеся материалы</h3>
              </div>

              <div className="col-md-6 mx-auto mt-3">
                <div className="card order">
                  <div className="card-body p-0">
                    <ul className="font-bold mb-0 list-unstyled">
                      {currentMaterials}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="container-fluid">
          {this.props.subadmin.loading ? <Spinner /> : (
            <div className="row">
              <div className="col-12">
                <h2 className="text-center mt-3">Ваши Заказы</h2>
              </div>
              {displayOrder}
            </div>
          )}
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  subadmin: state.subadmin,
  errors: state.errors
});

export default connect(mapStateToProps, { getSubadmOrders, getDisinfectorMaterials })(withRouter(SubadmOrders));