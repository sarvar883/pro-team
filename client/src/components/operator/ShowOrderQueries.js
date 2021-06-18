import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import { getCompleteOrders } from '../../actions/operatorActions';

class ShowOrderQueries extends Component {
  state = {
    completeOrders: this.props.operator.completeOrders
  };

  componentDidMount() {
    if (
      this.props.operator.completeOrders &&
      this.props.operator.completeOrders.length > 0
    ) {
      this.setState({
        completeOrders: this.props.operator.completeOrders
      });
    }
  }

  render() {
    let completeOrders = this.state.completeOrders.map((order, index) =>
      <div className="col-lg-4 col-md-6 mt-2" key={index}>
        <div className="card order mt-2">
          <div className="card-body p-0">
            <ul className="font-bold mb-0 list-unstyled">
              {order.prevFailedOrder && (
                <li><h4><i className="fas fas fa-exclamation"></i> Повторный заказ <i className="fas fas fa-exclamation"></i></h4></li>
              )}

              {order.failed && (
                <li><h4><i className="fas fas fa-exclamation"></i> Некачественный заказ <i className="fas fas fa-exclamation"></i></h4></li>
              )}

              {order.returnedBack && (
                <li className="text-danger">Это возвращенный заказ</li>
              )}

              {order.disinfectorId && (
                <li>Ответственный: {order.disinfectorId.occupation} {order.disinfectorId.name}</li>
              )}

              {order.clientType === 'corporate' ?
                <React.Fragment>
                  {order.clientId ? (
                    <li className="text-danger">Корпоративный Клиент: {order.clientId.name}</li>
                  ) : <li className="text-danger">Корпоративный Клиент</li>}
                  <li className="text-danger">Имя клиента: {order.client}</li>
                </React.Fragment>
                : ''}

              {order.clientType === 'individual' ?
                <li className="text-danger">Физический Клиент: {order.client}</li>
                : ''}

              <li className="text-danger">Телефон клиента: {order.phone}</li>
              {order.phone2 !== '' ? <li>Запасной номер: {order.phone2}</li> : ''}
              <li className="text-danger">Дата: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
              <li className="text-danger">Время выполнения: С <Moment format="HH:mm">{order.dateFrom}</Moment> ПО <Moment format="HH:mm">{order.completedAt}</Moment></li>
              <li>Адрес: {order.address}</li>
              <li>Тип услуги: {order.typeOfService}</li>
              <li>Срок гарантии (в месяцах): {order.guarantee}</li>

              <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{order.completedAt}</Moment></li>
            </ul>

            <Link to={`/order-confirm/${order._id}`} className="btn btn-dark mt-2"><i className="fab fa-wpforms"></i> Форма Подтверждения</Link>
          </div>
        </div>
      </div>
    );

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-12">
            <h2 className="text-center">Выполненные Заказы</h2>
          </div>

          <div className="col-12 mt-2">
            <button
              className="btn btn-primary"
              onClick={() => this.props.getCompleteOrders(this.props.auth.user.id)}
            >
              <i className="fas fa-redo-alt"></i> Обновить запросы
            </button>
          </div>

          {completeOrders}
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  operator: state.operator,
  errors: state.errors
});

export default connect(mapStateToProps, { getCompleteOrders })(withRouter(ShowOrderQueries));