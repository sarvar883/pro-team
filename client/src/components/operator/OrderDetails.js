import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';
import { getOrderById } from '../../actions/orderActions';

class OrderDetails extends Component {
  componentDidMount() {
    this.props.getOrderById(this.props.match.params.id);
  }

  render() {
    const order = this.props.order.orderById;

    return (
      <div className="container">
        {this.props.order.loading ? <Spinner /> : (
          <div className="row">
            <div className="col-12">
              <h1 className="text-center">Детали Заказа</h1>
            </div>
            <div className="col-lg-8 col-md-10 m-auto">
              <div className="card order mt-2">
                <div className="card-body p-0">
                  <ul className="font-bold list-unstyled">
                    {order.prevFailedOrder && <h3><i className="fas fas fa-exclamation"></i> Повторный заказ <i className="fas fas fa-exclamation"></i></h3>}

                    {order.failed && <h3><i className="fas fas fa-exclamation"></i> Некачественный заказ <i className="fas fas fa-exclamation"></i></h3>}

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
                    {order.phone2 !== '' ? (<li>Запасной номер: {order.phone2}</li>) : ''}
                    <li className="text-danger">Адрес: {order.address}</li>
                    <li className="text-danger">Тип услуги: {order.typeOfService}</li>

                    <li>Дата: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                    <li>Время выполнения: С <Moment format="HH:mm">{order.dateFrom}</Moment></li>
                    <li>Комментарии Оператора: {order.comment ? order.comment : '--'}</li>
                    <li>Комментарии Дезинфектора: {order.disinfectorComment ? order.disinfectorComment : '--'}</li>

                    {order.userAcceptedOrder ? (
                      <li>Заказ принял: {order.userAcceptedOrder.occupation} {order.userAcceptedOrder.name}</li>
                    ) : ''}

                    {order.userCreated && (
                      <li>Кто добавил заказ: {order.userCreated.occupation} {order.userCreated.name}</li>
                    )}

                    <li>Заказ Добавлен: <Moment format="DD/MM/YYYY HH:mm">{order.createdAt}</Moment></li>
                  </ul>
                </div>
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
  order: state.order,
  operator: state.operator,
  errors: state.errors
});

export default connect(mapStateToProps, { getOrderById })(withRouter(OrderDetails));