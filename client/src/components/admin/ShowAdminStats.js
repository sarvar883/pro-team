import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import removeZeros from '../../utils/removeZerosMat';
import calculateDisinfScore from '../../utils/calcDisinfScore';
import calculateStats from '../../utils/calcStats';
import calcMaterialConsumption from '../../utils/calcMatConsumption';

class ShowAdminStats extends Component {
  state = {
    orders: this.props.admin.stats.orders,
    showOrders: false
  };

  toggleShowOrders = (param) => {
    this.setState({
      showOrders: param
    });
  };

  render() {
    // calculate statistics
    let {
      totalSum,
      totalScore,
      totalOrders,
      completed,
      confirmedOrders,
      rejected,
      consultAndOsmotrConfirmed,

      failed,
      povtors,

      corporate,
      corporatePercent,
      corpSum,
      corpSumPercent,

      indiv,
      indivPercent,
      indivSum,
      indivSumPercent
    } = calculateStats(this.state.orders);


    // let totalSum = 0,
    //   totalScore = 0,
    //   totalConsumption = [],
    //   completedOrders = [],
    //   confirmedOrders = [],
    //   rejectedOrders = [],
    //   failedOrders = 0;

    // let corporateClientOrders = {
    //   sum: 0,
    //   orders: 0
    // };

    // let indivClientOrders = {
    //   sum: 0,
    //   orders: 0
    // };


    // let totalConsumption = [];
    // materials.forEach(object => {
    //   const emptyObject = {
    //     material: object.material,
    //     amount: 0,
    //     unit: object.unit
    //   };
    //   totalConsumption.push(emptyObject);
    // });

    // this.state.orders.forEach(order => {
    //   if (order.completed) {
    //     completedOrders.push(order);

    //     if (order.clientType === 'corporate') {

    //       if (order.paymentMethod === 'cash') {
    //         if (order.operatorConfirmed && order.adminConfirmed) {
    //           confirmedOrders.push(order);
    //           totalSum += order.cost;
    //           totalScore += order.score;

    //           corporateClientOrders.orders++;
    //           corporateClientOrders.sum += order.cost;
    //         }

    //         if ((order.operatorDecided && !order.operatorConfirmed) || (order.adminDecided && !order.adminConfirmed)) {
    //           rejectedOrders.push(order);
    //         }
    //       }

    //       if (order.paymentMethod === 'notCash') {
    //         if (order.operatorConfirmed && order.accountantConfirmed) {
    //           confirmedOrders.push(order);
    //           totalSum += order.cost;
    //           totalScore += order.score;

    //           corporateClientOrders.orders++;
    //           corporateClientOrders.sum += order.cost;
    //         }
    //         if ((order.operatorDecided && !order.operatorConfirmed) || (order.accountantDecided && !order.accountantConfirmed)) {
    //           rejectedOrders.push(order);
    //         }
    //       }
    //     }

    //     if (order.clientType === 'individual') {
    //       if (order.operatorConfirmed && order.adminConfirmed) {
    //         confirmedOrders.push(order);
    //         totalSum += order.cost;
    //         totalScore += order.score;

    //         indivClientOrders.orders++;
    //         indivClientOrders.sum += order.cost;
    //       }
    //       if ((order.operatorDecided && !order.operatorConfirmed) || (order.adminDecided && !order.adminConfirmed)) {
    //         rejectedOrders.push(order);
    //       }
    //     }

    //     if (order.failed) {
    //       failedOrders++;
    //     }

    //     // calculate total consumption of all orders in given period
    //     order.disinfectors.forEach(element => {
    //       element.consumption.forEach(object => {
    //         totalConsumption.forEach(item => {
    //           if (object.material === item.material && object.unit === item.unit) {
    //             item.amount += object.amount;
    //           }
    //         });
    //       });
    //     });
    //   }
    // });


    // не считать расходы материалов у повторных и некачественных заказов (++)
    // заказ, который не является некачественным и не является повторным
    let approvedOrders = this.state.orders.filter(order =>
      order.completed &&
      !order.failed &&
      !order.hasOwnProperty('prevFailedOrder')
    );

    // calculate total consumption of all orders in given period
    let totalConsumption = calcMaterialConsumption(approvedOrders);


    // this.state.orders.forEach(order => {
    //   if (order.completed) {
    //     order.disinfectors.forEach(element => {
    //       element.consumption.forEach(object => {
    //         totalConsumption.forEach(item => {
    //           if (object.material === item.material && object.unit === item.unit) {
    //             item.amount += object.amount;
    //           }
    //         });
    //       });
    //     });
    //   }
    // });


    // calculate average score
    let averageScore = calculateDisinfScore({
      totalScore: totalScore,
      totalOrders: confirmedOrders.length,
      failedOrders: failed
    }) || 0;

    // remove materials with amount of 0
    totalConsumption = removeZeros(totalConsumption);

    let renderTotalConsumption = totalConsumption.map((item, key) =>
      <li key={key}>{item.material}: {item.amount.toLocaleString()} {item.unit}</li>
    );

    let renderAllOrders = this.state.orders.map((order, key) => {
      // let renderConfirmedOrders = confirmedOrders.map((order, key) => {
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

                {!order.completed && (
                  <li>Заказ еще не выполнен</li>
                )}

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

                <li className="text-danger">Телефон: {order.phone}</li>
                {order.phone2 && order.phone2 !== '' ? (
                  <li className="text-danger">Запасной номер: {order.phone2}</li>
                ) : ''}

                {order.completed ? (
                  <React.Fragment>
                    <li className="text-danger">Дата выполнения: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                    <li className="text-danger">Время выполнения: С <Moment format="HH:mm">{order.dateFrom}</Moment> ПО <Moment format="HH:mm">{order.completedAt}</Moment></li>
                  </React.Fragment>
                ) : (
                  <li className="text-danger">Дата выполнения: <Moment format="DD/MM/YYYY HH:mm">{order.dateFrom}</Moment></li>
                )}

                <li className="text-danger">Адрес: {order.address}</li>
                <li className="text-danger">Тип услуги: {order.typeOfService}</li>

                <li>Комментарии Оператора: {order.comment ? order.comment : '--'}</li>
                <li>Комментарии Дезинфектора: {order.disinfectorComment ? order.disinfectorComment : '--'}</li>

                {order.completed &&
                  <React.Fragment>
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
                            <li>Номер Договора: {order.contractNumber}</li>
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    ) : ''}
                  </React.Fragment>
                }

                {order.completed && order.clientType === 'individual' && order.cost ?
                  <li>Общая Сумма: {order.cost.toLocaleString()} UZS (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                  : ''}
                {/* <Link className="btn btn-primary" to={`/order-full-details/${order._id}`}>Подробнее</Link> */}
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
                <h4 className="text-center">Заказы</h4>
                <ul className="font-bold mb-0 list-unstyled">
                  <li>Всего Получено Заказов: {totalOrders}</li>
                  <li>Выполнено Заказов: {completed}</li>
                  <li>Подтверждено Заказов: {confirmedOrders.length} (из них Консультации и Осмотры: {consultAndOsmotrConfirmed})</li>

                  <li className="pt-2">Общая Сумма: {totalSum.toLocaleString()} UZS</li>
                  <li className="pb-2">Средний балл: {averageScore.toFixed(2)} (из 5)</li>

                  <li>Отвергнуто Заказов: {rejected}</li>
                  <li>Некачественные заказы: {failed}</li>
                  <li>Повторные заказы: {povtors}</li>

                  <h6 className="mt-2">* некачественные и повторные заказы не входят в подтвержденные заказы и общую сумму</h6>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <ul className="font-bold mb-0 list-unstyled">

                  <h4 className="text-center">Корпоративные клиенты</h4>
                  <li>Подтвержденные заказы: {corporate} ({corporatePercent} %)</li>
                  <li>На общую сумму: {corpSum.toLocaleString()} UZS  ({corpSumPercent} %)</li>

                  <h4 className="text-center">Физические клиенты</h4>
                  <li>Подтвержденные заказы: {indiv} ({indivPercent} %)</li>
                  <li>На общую сумму: {indivSum.toLocaleString()} UZS ({indivSumPercent} %)</li>
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

                  <h6 className="mt-2">* сюда не входят некачественные и повторные заказы</h6>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {this.state.showOrders ? (
          <React.Fragment>
            <div className="row mt-2">
              <div className="col-12">
                <button className="btn btn-dark" onClick={this.toggleShowOrders.bind(this, false)}><i className="fas fa-eye-slash"></i> Скрыть заказы</button>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-12">
                {/* <h2 className="text-center pl-3 pr-3">Подтвержденные Заказы</h2> */}
                <h2 className="text-center pl-3 pr-3">Все Заказы</h2>
              </div>

              {/* {confirmedOrders.length > 0 ? (renderConfirmedOrders) : <h2>Нет подтвержденных заказов</h2>} */}
              {this.state.orders.length > 0 ? (renderAllOrders) : <h2>Нет заказов</h2>}
            </div>
          </React.Fragment>
        ) : (
          <button className="btn btn-dark mt-2" onClick={this.toggleShowOrders.bind(this, true)}><i className="fas fa-eye"></i> Показать заказы</button>
        )}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  admin: state.admin,
  errors: state.errors
});

export default connect(mapStateToProps)(withRouter(ShowAdminStats));