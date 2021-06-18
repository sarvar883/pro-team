import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import { getNotCompOrders } from '../../actions/operatorActions'
import { deleteOrder } from '../../actions/orderActions';

class NotCompOrders extends Component {
  componentDidMount() {
    this.props.getNotCompOrders();
  }

  deleteOrderFunc = (order) => {
    let clientId = '';

    if (order.clientType === 'corporate') {
      if (order.clientId) {
        clientId = order.clientId._id;
      }
    }

    const object = {
      id: order._id,
      clientType: order.clientType,
      clientPhone: order.phone,
      clientId: clientId,
      orderDateFrom: order.dateFrom
    };
    this.props.deleteOrder(object, this.props.history, 'not-completed-orders');
  };

  render() {
    let orders = this.props.operator.sortedOrders.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

    let renderOrders = orders.map((order, index) =>
      <div className="col-lg-4 col-md-6 col-sm-6 mt-2" key={index}>
        <div className="card order mt-2">
          <div className="card-body p-0">
            <ul className="font-bold list-unstyled mb-0">
              {order.disinfectorId && (
                <li>Ответственный: {order.disinfectorId.occupation} {order.disinfectorId.name}</li>
              )}

              <li>Дата: <Moment format="DD/MM/YYYY HH:mm">{order.dateFrom}</Moment></li>

              {order.clientType === 'corporate' ?
                <React.Fragment>
                  {order.clientId ? (
                    <li>Корпоративный Клиент: {order.clientId.name}</li>
                  ) : <li>Корпоративный Клиент</li>}
                  <li>Имя клиента: {order.client}</li>
                </React.Fragment>
                : ''}

              {order.clientType === 'individual' ?
                <li>Физический Клиент: {order.client}</li>
                : ''}

              <li>Телефон клиента: {order.phone}</li>
              {order.phone2 !== '' ? (<li>Запасной номер: {order.phone2}</li>) : ''}
              <li>Адрес: {order.address}</li>
              <li>Тип заказа: {order.typeOfService}</li>
              <div className="btn-group">
                {/* <Link to={`/order-details/${order._id}`} className="btn btn-primary mt-1">Подробнее</Link> */}
                <button className="btn btn-danger mt-1" onClick={() => {
                  if (window.confirm('Вы уверены?')) {
                    this.deleteOrderFunc(order);
                  }
                }}><i className="fas fa-trash-alt"></i> Удалить</button>
              </div>
            </ul>
          </div>
        </div>
      </div>
    );

    return (
      <div className="container-fluid">
        <div className="row m-0">
          <div className="col-12">
            <h2 className="text-center">Невыполненные заказы</h2>
          </div>
        </div>

        {this.props.operator.loadingSortedOrders ? <Spinner /> : (
          <div className="row">
            <div className="col-12">
              <div className="row">
                {renderOrders}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
  operator: state.operator,
  errors: state.errors
});

export default connect(mapStateToProps, { getNotCompOrders, deleteOrder })(withRouter(NotCompOrders));