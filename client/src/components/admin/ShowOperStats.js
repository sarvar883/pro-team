import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import materials from '../common/materials';
import removeZeros from '../../utils/removeZerosMat';
import calculateDisinfScore from '../../utils/calcDisinfScore';
import calculateStats from '../../utils/calcStats';


class ShowOperStats extends Component {
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
    const { orders } = this.state;


    // calculate statistics
    let {
      totalSum,
      totalScore,
      totalOrders,
      completed,
      confirmedOrders,
      rejected,
      failed,

      corporate,
      corporatePercent,
      corpSum,
      corpSumPercent,

      indiv,
      indivPercent,
      indivSum,
      indivSumPercent
    } = calculateStats(orders);

    let totalConsumption = [];

    materials.forEach(object => {
      const emptyObject = {
        material: object.material,
        amount: 0,
        unit: object.unit
      };
      totalConsumption.push(emptyObject);
    });

    // calculate total consumption of all orders in given period
    orders.forEach(order => {
      if (order.completed) {
        order.disinfectors.forEach(element => {
          element.consumption.forEach(object => {
            totalConsumption.forEach(item => {
              if (object.material === item.material && object.unit === item.unit) {
                item.amount += object.amount;
              }
            });
          });
        });
      }
    });


    // calculate average score
    let averageScore = calculateDisinfScore({
      totalScore: totalScore,
      totalOrders: confirmedOrders.length,
      failedOrders: failed
    }) || 0;

    // remove materials with amount of 0
    totalConsumption = removeZeros(totalConsumption);

    let renderTotalConsumption = totalConsumption.map((element, key) =>
      <li key={key}>{element.material}: {element.amount.toLocaleString()} {element.unit}</li>
    );



    let renderOrders = orders.map((item, key) => {
      // consumption array of specific confirmed order
      let consumptionArray = [];

      item.disinfectors.forEach(item => {
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
                {item.disinfectorId ? (
                  <li>Ответственный: {item.disinfectorId.occupation} {item.disinfectorId.name}</li>
                ) : ''}

                {item.failed && <li className="text-danger">Это некачественный заказ</li>}

                {item.operatorDecided ? (
                  <React.Fragment>
                    <li>Оператор рассмотрел заявку</li>
                    {item.operatorConfirmed ? (
                      <React.Fragment>
                        <li className="text-success">Оператор Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{item.operatorCheckedAt}</Moment>)</li>
                        <li>Балл (0-5): {item.score}</li>
                        <li>Отзыв Клиента: {item.clientReview ? item.clientReview : 'Нет Отзыва'}</li>
                      </React.Fragment>
                    ) : <li className="text-danger">Оператор Отклонил (<Moment format="DD/MM/YYYY HH:mm">{item.operatorCheckedAt}</Moment>)</li>}
                  </React.Fragment>
                ) : <li>Оператор еще не рассмотрел заявку</li>}

                {item.accountantDecided ? (
                  <React.Fragment>
                    <li>Бухгалтер рассмотрел заявку</li>
                    {item.accountantConfirmed ? (
                      <React.Fragment>
                        <li className="text-success">Бухгалтер Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{item.accountantCheckedAt}</Moment>)</li>
                        <li>Счет-Фактура: {item.invoice ? item.invoice : '--'}</li>
                        <li>Общая Сумма: {item.cost.toLocaleString()} UZS (каждому по {(item.cost / item.disinfectors.length).toLocaleString()} UZS)</li>
                      </React.Fragment>
                    ) : <li className="text-danger">Бухгалтер Отклонил (<Moment format="DD/MM/YYYY HH:mm">{item.accountantCheckedAt}</Moment>)</li>}
                  </React.Fragment>
                ) : (
                  <React.Fragment>

                    {item.adminDecided ? (
                      <React.Fragment>
                        <li>Админ рассмотрел заявку</li>
                        {item.adminConfirmed ? (
                          <li className="text-success">Админ Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{item.adminCheckedAt}</Moment>)</li>
                        ) : <li className="text-danger">Админ Отклонил (<Moment format="DD/MM/YYYY HH:mm">{item.adminCheckedAt}</Moment>)</li>}
                      </React.Fragment>
                    ) : (
                      <li>Бухгалтер еще не рассмотрел заявку</li>
                    )}

                  </React.Fragment>
                )}

                {item.clientType === 'corporate' ?
                  <React.Fragment>
                    {item.clientId ? (
                      <li className="text-danger">Корпоративный Клиент: {item.clientId.name}</li>
                    ) : <li className="text-danger">Корпоративный Клиент</li>}
                    <li className="text-danger">Имя клиента: {item.client}</li>
                  </React.Fragment>
                  : ''}

                {item.clientType === 'individual' ?
                  <li className="text-danger">Физический Клиент: {item.client}</li>
                  : ''}

                <li className="text-danger">Дата выполнения: <Moment format="DD/MM/YYYY">{item.dateFrom}</Moment></li>
                {item.completed ? (
                  <li className="text-danger">Время выполнения: С <Moment format="HH:mm">{item.dateFrom}</Moment> ПО <Moment format="HH:mm">{item.completedAt}</Moment></li>
                ) : (
                  <li className="text-danger">Время выполнения: С <Moment format="HH:mm">{item.dateFrom}</Moment></li>
                )}
                <li className="text-danger">Адрес: {item.address}</li>
                <li className="text-danger">Тип услуги: {item.typeOfService}</li>

                <li>Комментарии Оператора: {item.comment ? item.comment : '--'}</li>
                <li>Комментарии Дезинфектора: {item.disinfectorComment ? item.disinfectorComment : '--'}</li>
                <li>Срок гарантии (в месяцах): {item.guarantee}</li>

                <li>Расход Материалов (заказ выполнили {item.disinfectors.length} чел):</li>
                <ul className="font-bold mb-0">
                  {renderOrderConsumption}
                </ul>

                {item.completed && item.clientType === 'corporate' ? (
                  <React.Fragment>
                    {item.paymentMethod === 'cash' ? (
                      <React.Fragment>
                        <li>Тип Платежа: Наличный</li>
                        <li>Общая Сумма: {item.cost.toLocaleString()} UZS (каждому по {(item.cost / item.disinfectors.length).toLocaleString()} UZS)</li>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <li>Тип Платежа: Безналичный</li>
                        <li>Номер Договора: {item.contractNumber}</li>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ) : ''}

                {item.completed && item.clientType === 'individual' && item.cost ?
                  <li>Общая Сумма: {item.cost.toLocaleString()} UZS (каждому по {(item.cost / item.disinfectors.length).toLocaleString()} UZS)</li>
                  : ''}
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
                <ul className="font-bold mb-0 list-unstyled">
                  <li>Пользователь принял Заказов: {totalOrders}</li>
                  <li>Выполнено Заказов: {completed}</li>
                  <li>Подтверждено Заказов: {confirmedOrders.length}</li>
                  <li>Общая Сумма: {totalSum.toLocaleString()} UZS</li>
                  <li className="pb-2">Средний балл: {averageScore} (из 5)</li>
                  {/* <li>Средний балл: {(totalScore / confirmedOrders.length).toFixed(2)} (из 5)</li> */}
                  <li>Отвергнуто Заказов: {rejected}</li>
                  <li>Некачественные заказы: {failed}</li>
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
                <h4 className="text-center">На этих заказах расходовано материалов:</h4>
                <ul className="font-bold mb-0 list-unstyled">
                  {renderTotalConsumption}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {this.state.showOrders ? (
          <React.Fragment>
            <div className="row mt-2">
              <div className="col-12">
                <button className="btn btn-dark" onClick={this.toggleShowOrders.bind(this, false)}>Скрыть заказы</button>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-12">
                <h2 className="text-center pl-3 pr-3">Заказы, которые принял Пользователь</h2>
              </div>
              {orders.length > 0 ? (renderOrders) : <h2>Нет заказов</h2>}
            </div>
          </React.Fragment>
        ) : (
          <button className="btn btn-dark mt-2" onClick={this.toggleShowOrders.bind(this, true)}>Показать заказы</button>
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

export default connect(mapStateToProps)(withRouter(ShowOperStats));