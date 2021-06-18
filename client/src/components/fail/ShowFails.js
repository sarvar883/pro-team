import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import ClientNotSatisfiedButton from '../common/ClientNotSatisfiedButton';

import removeZeros from '../../utils/removeZerosMat';
import calcMaterialConsumption from '../../utils/calcMatConsumption';
// import materials from '../common/materials';
// import guaranteeExpired from '../../utils/guaranteeExpired';


class ShowFails extends Component {
  state = {
    // некачественные и повторные заказы
    fails: []
  };

  componentDidMount() {
    if (this.props.fail.fails && this.props.fail.fails.length > 0) {
      this.setState({
        fails: this.props.fail.fails
      });
    }
  }

  // goToAddNewForm = (item) => {
  //   this.props.history.push(`/fail/add-new/${item._id}`, {
  //     pathname: `/fail/add-new/${item._id}`,
  //     state: { order: item, shouldLoadOrder: true }
  //   });
  // };

  render() {
    // let totalConsumption = [];
    // materials.forEach(object => {
    //   const emptyObject = {
    //     material: object.material,
    //     amount: 0,
    //     unit: object.unit
    //   };
    //   totalConsumption.push(emptyObject);
    // });

    // this.state.fails.forEach(order => {
    //   // calculate total consumption of all orders in given period
    //   order.disinfectors.forEach(element => {
    //     element.consumption.forEach(object => {
    //       totalConsumption.forEach(item => {
    //         if (object.material === item.material && object.unit === item.unit) {
    //           item.amount += object.amount;
    //         }
    //       });
    //     });
    //   });
    // });

    // calculate total consumption of failed and repeated orders in given period
    let totalConsumption = calcMaterialConsumption(this.state.fails);

    // remove materials with amount of 0
    totalConsumption = removeZeros(totalConsumption);

    let renderTotalConsumption = totalConsumption.map((item, key) =>
      <li key={key}>{item.material}: {item.amount.toLocaleString()} {item.unit}</li>
    );


    let failedCount = 0;
    let povtorsCount = 0;

    let renderFailedOrders = this.state.fails.map((order, key) => {
      if (order.failed) failedCount++;

      if (order.hasOwnProperty('prevFailedOrder')) povtorsCount++;


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
        <div className="col-lg-4 col-md-6" key={key}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 list-unstyled">
                {order.prevFailedOrder && (
                  <li><h4><i className="fas fas fa-exclamation"></i> Повторный заказ <i className="fas fas fa-exclamation"></i></h4></li>
                )}

                {order.failed && (
                  <li><h4><i className="fas fas fa-exclamation"></i> Некачественный заказ <i className="fas fas fa-exclamation"></i></h4></li>
                )}

                {order.disinfectorId && (
                  <li>Ответственный: {order.disinfectorId.occupation} {order.disinfectorId.name}</li>
                )}


                {order.failed && order.nextOrdersAfterFailArray && (
                  <React.Fragment>
                    <li className="text-primary">Повторов у этого заказа: {order.nextOrdersAfterFailArray.length}</li>

                    {order.nextOrdersAfterFailArray.length > 0 && (
                      <React.Fragment>
                        <li className="text-primary">Время последнего заказа: <Moment format="DD/MM/YYYY HH:mm">{order.nextOrdersAfterFailArray[order.nextOrdersAfterFailArray.length - 1].dateFrom}</Moment></li>

                        <li className="text-primary">Выполняет последний заказ: {order.nextOrdersAfterFailArray[order.nextOrdersAfterFailArray.length - 1].disinfectorId.occupation} {order.nextOrdersAfterFailArray[order.nextOrdersAfterFailArray.length - 1].disinfectorId.name}</li>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}

                {/* {order.nextOrdersAfterFailArray && order.nextOrdersAfterFailArray.length > 0 && (
                  <React.Fragment>
                    <li className="text-primary">Время последнего заказа: <Moment format="DD/MM/YYYY HH:mm">{order.nextOrdersAfterFailArray[order.nextOrdersAfterFailArray.length - 1].dateFrom}</Moment></li>

                    <li className="text-primary">Выполняет последний заказ: {order.nextOrdersAfterFailArray[order.nextOrdersAfterFailArray.length - 1].disinfectorId.occupation} {order.nextOrdersAfterFailArray[order.nextOrdersAfterFailArray.length - 1].disinfectorId.name}</li>
                  </React.Fragment>
                )} */}


                {order.prevFailedOrder && order.prevFailedOrder.disinfectorId && (
                  <li className="text-primary">Предыдущий некачественный заказ: <Moment format="DD/MM/YYYY HH:mm">{order.prevFailedOrder.dateFrom}</Moment> ({order.prevFailedOrder.disinfectorId.occupation} {order.prevFailedOrder.disinfectorId.name})</li>
                )}

                {/* {order.nextOrderAfterFail && order.nextOrderAfterFail.dateFrom && (
                  <li className="text-primary">Время следующего заказа: <Moment format="DD/MM/YYYY HH:mm">{order.nextOrderAfterFail.dateFrom}</Moment></li>
                )}

                {order.nextOrderAfterFail && order.nextOrderAfterFail.disinfectorId && (
                  <li className="text-primary">Выполняет следующий заказ: {order.nextOrderAfterFail.disinfectorId.occupation} {order.nextOrderAfterFail.disinfectorId.name}</li>
                )} */}

                {order.operatorDecided ? (
                  <React.Fragment>
                    <li>Оператор рассмотрел заявку</li>
                    {order.operatorConfirmed ? (
                      <React.Fragment>
                        <li className="text-success">Оператор Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{order.operatorCheckedAt}</Moment>)</li>
                        <li>Балл (0-5): {order.score}</li>
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






                {/* {order.clientType === 'corporate' && order.paymentMethod === 'notCash' && !order.accountantDecided ? <li>Бухгалтер еще не рассмотрел заявку</li> : ''}

                {order.clientType === 'corporate' && order.paymentMethod === 'notCash' && order.accountantDecided ?
                  <React.Fragment>
                    <li>Бухгалтер рассмотрел заявку</li>
                    {order.accountantConfirmed ? (
                      <React.Fragment>
                        <li className="text-success">Бухгалтер Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{order.accountantCheckedAt}</Moment>)</li>
                        <li>Счет-Фактура: {order.invoice}</li>
                        <li>Общая Сумма: {order.cost.toLocaleString()} UZS (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                      </React.Fragment>
                    ) : <li className="text-danger">Бухгалтер Отклонил (<Moment format="DD/MM/YYYY HH:mm">{order.accountantCheckedAt}</Moment>)</li>}
                  </React.Fragment>
                  : ''}

                {order.clientType === 'corporate' && order.paymentMethod === 'cash' && !order.adminDecided ? <li>Админ еще не рассмотрел заявку</li> : ''}

                {order.clientType === 'corporate' && order.paymentMethod === 'cash' && order.adminDecided ? (
                  <React.Fragment>
                    <li>Админ рассмотрел заявку</li>
                    {order.adminConfirmed ? (
                      <li className="text-success">Админ Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{order.adminCheckedAt}</Moment>)</li>
                    ) : <li className="text-danger">Админ Отклонил (<Moment format="DD/MM/YYYY HH:mm">{order.adminCheckedAt}</Moment>)</li>}
                  </React.Fragment>
                ) : ''}

                {order.clientType === 'individual' && !order.adminDecided ? <li>Админ еще не рассмотрел заявку</li> : ''}
                {order.clientType === 'individual' && order.adminDecided ? (
                  <React.Fragment>
                    <li>Админ рассмотрел заявку</li>
                    {order.adminConfirmed ? (
                      <li className="text-success">Админ Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{order.adminCheckedAt}</Moment>)</li>
                    ) : <li className="text-danger">Админ Отклонил (<Moment format="DD/MM/YYYY HH:mm">{order.adminCheckedAt}</Moment>)</li>}
                  </React.Fragment>
                ) : ''} */}









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
                        <li>Общая Сумма: {order.cost.toLocaleString()} UZS (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <li>Тип Платежа: Безналичный</li>
                        <li>Номер Договора: {order.contractNumber || '--'}</li>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ) : ''}

                {order.clientType === 'individual' ?
                  <li>Общая Сумма: {order.cost.toLocaleString()} UZS (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                  : ''}

                {/* show клиент недоволен button */}
                {/* {['admin', 'accountant', 'subadmin', 'operator'].includes(this.props.auth.user.occupation) &&
                  order.completed && !order.failed && order.guarantee &&
                  !guaranteeExpired(order.completedAt, order.guarantee) ? (
                  <button
                    className="btn btn-secondary mt-2 mr-2"
                    onClick={() => this.goToAddNewForm(order)}
                  >Клиент Недоволен</button>
                ) : ''} */}

                <ClientNotSatisfiedButton
                  order={order}
                  shouldLoadOrder={true}
                />

              </ul>
            </div>
          </div>
        </div>
      );
    });

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <ul className="font-bold mb-0 list-unstyled">
                  <li>Всего Некачественных Заказов: {failedCount}</li>
                  <li>Всего Повторных Заказов: {povtorsCount}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <h4 className="text-center">Общий Расход Материалов на этих заказах</h4>
                <ul className="font-bold mb-0 list-unstyled">
                  {renderTotalConsumption}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {this.state.fails.length > 0 && (
          <div className="row mt-2">
            <div className="col-12">
              <h2 className="text-center pl-3 pr-3">Некачественные и Повторные Заказы</h2>
            </div>
            {renderFailedOrders}
          </div>
        )}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  admin: state.admin,
  fail: state.fail,
  errors: state.errors
});

export default connect(mapStateToProps)(withRouter(ShowFails));