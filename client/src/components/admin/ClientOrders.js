import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import materials from '../common/materials';
import removeZeros from '../../utils/removeZerosMat';
import guaranteeExpired from '../../utils/guaranteeExpired';

class ClientOrders extends Component {
  state = {
    orders: []
  };

  componentDidMount() {
    if (this.props.admin.ordersOfClient && this.props.admin.ordersOfClient.length > 0) {
      this.setState({
        orders: this.props.admin.ordersOfClient
      });
    }
  }

  goToAddNewForm = (order) => {
    this.props.history.push(`/fail/add-new/${order._id}`, {
      pathname: `/fail/add-new/${order._id}`,
      state: { order, shouldLoadOrder: true }
    });
  };

  render() {
    let totalSum = 0,
      totalScore = 0,
      totalConsumption = [],
      completedOrders = 0,
      confirmedOrders = 0,
      rejectedOrders = 0,
      failedOrders = 0;

    materials.forEach(object => {
      const emptyObject = {
        material: object.material,
        amount: 0,
        unit: object.unit
      };
      totalConsumption.push(emptyObject);
    });

    this.state.orders.forEach(order => {
      if (order.completed) {
        completedOrders++;
      }

      if (order.clientType === 'corporate') {

        if (order.paymentMethod === 'cash') {
          if (order.operatorConfirmed && order.adminConfirmed) {
            confirmedOrders++;
            totalSum += order.cost;
            totalScore += order.score;
          }

          if ((order.operatorDecided && !order.operatorConfirmed) || (order.adminDecided && !order.adminConfirmed)) {
            rejectedOrders++;
          }
        }

        if (order.paymentMethod === 'notCash') {
          if (order.operatorConfirmed && order.accountantConfirmed) {
            confirmedOrders++;
            totalSum += order.cost;
            totalScore += order.score;
          }
          if (
            (order.operatorDecided && !order.operatorConfirmed) ||
            (order.accountantDecided && !order.accountantConfirmed)
          ) {
            rejectedOrders++;
          }
        }
      }

      if (order.clientType === 'individual') {
        if (order.operatorConfirmed && order.adminConfirmed) {
          confirmedOrders++;
          totalSum += order.cost;
          totalScore += order.score;
        }
        if (
          (order.operatorDecided && !order.operatorConfirmed) ||
          (order.adminDecided && !order.adminConfirmed)
        ) {
          rejectedOrders++;
        }
      }

      if (order.failed) {
        failedOrders++;
      }

      // calculate total consumption of all orders in given period
      order.disinfectors.forEach(element => {
        element.consumption.forEach(object => {
          totalConsumption.forEach(item => {
            if (object.material === item.material && object.unit === item.unit) {
              item.amount += object.amount;
            }
          });
        });
      });
    });

    // remove materials with amount of 0
    totalConsumption = removeZeros(totalConsumption);


    let renderTotalConsumption = totalConsumption.map((item, key) =>
      <li key={key}>{item.material}: {item.amount.toLocaleString()} {item.unit}</li>
    );


    let renderOrders = this.state.orders.map((order, index) => {
      // consumption array of specific confirmed order
      let consumptionArray = [];

      order.disinfectors.forEach(item => {
        consumptionArray.push({
          user: item.user,
          consumption: item.consumption
        });
      });

      let renderOrderConsumption = consumptionArray.map((object, number) =>
        <li key={number}>
          <p className="mb-0">Пользователь: {object.user.occupation} {object.user.name}</p>
          {object.consumption.map((element, number) =>
            <p key={number} className="mb-0">{element.material}: {element.amount.toLocaleString()} {element.unit}</p>
          )}
        </li>
      );

      return (
        <div className="col-lg-4 col-md-6" key={index}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 list-unstyled">
                <li>Ответственный: {order.disinfectorId.occupation} {order.disinfectorId.name}</li>

                {order.failed && <li className="text-danger">Это некачественный заказ</li>}

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

                <li className="text-danger">Телефон Клиента: {order.phone}</li>
                {order.phone2 ? <li>Другой номер: {order.phone2}</li> : ''}
                <li className="text-danger">Дата выполнения: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                <li className="text-danger">Время выполнения: С <Moment format="HH:mm">{order.dateFrom}</Moment> ПО <Moment format="HH:mm">{order.completedAt}</Moment></li>
                <li className="text-danger">Адрес: {order.address}</li>
                <li className="text-danger">Тип услуги: {order.typeOfService}</li>
                <li>Комментарии Оператора: {order.comment ? order.comment : '--'}</li>
                <li>Комментарии Дезинфектора: {order.disinfectorComment ? order.disinfectorComment : '--'}</li>
                <li>Срок гарантии (в месяцах): {order.guarantee}</li>

                <li>Расход Материалов (заказ выполнили {order.disinfectors.length} чел):</li>
                <ul className="font-bold mb-0">
                  {renderOrderConsumption}
                </ul>

                {order.clientType === 'corporate' ? (
                  <React.Fragment>
                    {order.paymentMethod === 'cash' ? (
                      <React.Fragment>
                        <li>Тип Платежа: Наличный</li>
                        {order.cost && <li>Общая Сумма: {order.cost.toLocaleString()} UZS (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <li>Тип Платежа: Безналичный</li>
                        <li>Номер Договора: {order.contractNumber}</li>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ) : ''}

                {order.clientType === 'individual' && order.cost ?
                  <li>Общая Сумма: {order.cost.toLocaleString()} UZS (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                  : ''}

                <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{order.completedAt}</Moment></li>

                {['admin', 'subadmin', 'operator'].includes(this.props.auth.user.occupation) &&
                  order.completed && !order.failed && order.guarantee &&
                  !guaranteeExpired(order.completedAt, order.guarantee) ?
                  (
                    <div className="btn-group">
                      <button
                        className="btn btn-secondary mt-2 mr-2"
                        onClick={() => this.goToAddNewForm(order)}
                      >Клиент Недоволен</button>
                    </div>
                  ) : ''
                }
              </ul>
            </div>
          </div>
        </div>
      )
    });


    return (
      <React.Fragment>
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <h3 className="text-center">Заказы</h3>
                <ul className="font-bold mb-0 list-unstyled">
                  <li>Всего Получено Заказов: {this.state.orders.length}</li>
                  <li>Выполнено Заказов: {completedOrders}</li>
                  <li>Подтверждено Заказов: {confirmedOrders}</li>
                  <li>Общая Сумма: {totalSum.toLocaleString()} UZS</li>
                  <li>Средний балл: {(totalScore / confirmedOrders).toFixed(2)} (из 5)</li>
                  <li>Отвергнуто Заказов: {rejectedOrders}</li>
                  <li>Некачественные заказы: {failedOrders}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <h4 className="text-center">Общий Расход Материалов:</h4>
                <ul className="font-bold mb-0 list-unstyled">
                  {renderTotalConsumption}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {this.state.orders.length > 0 && (
          <React.Fragment>
            <div className="row">
              <div className="col-12">
                <h2 className="text-center pl-3 pr-3">Заказы</h2>
              </div>
            </div>

            <div className="row">
              {renderOrders}
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  admin: state.admin,
  errors: state.errors
});

export default connect(mapStateToProps, {})(withRouter(ClientOrders));