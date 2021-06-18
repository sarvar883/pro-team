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
              <h2 className="text-center">Детали Заказа</h2>
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


                    {order.operatorDecided ? (
                      <React.Fragment>
                        <li>Оператор рассмотрел заявку</li>
                        {order.operatorConfirmed ? (
                          <React.Fragment>
                            <li className="text-success">Оператор Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{order.operatorCheckedAt}</Moment>)</li>
                            <li>Балл (0-5): {order.score}</li>
                            <li>Отзыв Клиента: {order.clientReview ? order.clientReview : 'Нет Отзыва'}</li>
                          </React.Fragment>
                        ) : <li className="text-danger">Оператор Отклонил (<Moment format="DD/MM/YYYY HH:mm">{order.operatorCheckedAt}</Moment>)</li>}
                      </React.Fragment>
                    ) : <li>Оператор еще не рассмотрел заявку</li>}

                    {order.accountantDecided ? (
                      <React.Fragment>
                        <li>Бухгалтер рассмотрел заявку</li>
                        {order.accountantConfirmed ? (
                          <React.Fragment>
                            <li className="text-success">Бухгалтер Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{order.accountantCheckedAt}</Moment>)</li>
                            <li>Счет-Фактура: {order.invoice ? order.invoice : '--'}</li>
                            <li>Общая Сумма: {order.cost.toLocaleString()} UZS (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                          </React.Fragment>
                        ) : <li className="text-danger">Бухгалтер Отклонил (<Moment format="DD/MM/YYYY HH:mm">{order.accountantCheckedAt}</Moment>)</li>}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>

                        {order.adminDecided ? (
                          <React.Fragment>
                            <li>Админ рассмотрел заявку</li>
                            {order.adminConfirmed ? (
                              <li className="text-success">Админ Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{order.adminCheckedAt}</Moment>)</li>
                            ) : <li className="text-danger">Админ Отклонил (<Moment format="DD/MM/YYYY HH:mm">{order.adminCheckedAt}</Moment>)</li>}
                          </React.Fragment>
                        ) : (
                          <li>Бухгалтер еще не рассмотрел заявку</li>
                        )}

                      </React.Fragment>
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

                    {/* <li>Дата: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                    <li>Время выполнения: С <Moment format="HH:mm">{order.dateFrom}</Moment></li> */}

                    {order.dateFrom ? (
                      <React.Fragment>
                        <li>Дата: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                        {order.completed ? (
                          <li>Время выполнения: С <Moment format="HH:mm">{order.dateFrom}</Moment> ПО <Moment format="HH:mm">{order.completedAt}</Moment></li>
                        ) : <li>Время выполнения: <Moment format="HH:mm">{order.dateFrom}</Moment></li>}
                      </React.Fragment>
                    ) : <li>Дата и время выполнения: --</li>}


                    <li>Комментарии Оператора: {order.comment ? order.comment : '--'}</li>
                    <li>Комментарии Дезинфектора: {order.disinfectorComment ? order.disinfectorComment : '--'}</li>

                    {order.userAcceptedOrder && (
                      <li>Заказ принял: {order.userAcceptedOrder.occupation} {order.userAcceptedOrder.name}</li>
                    )}

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