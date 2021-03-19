import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// import Moment from 'react-moment';

import materials from '../common/materials';
import removeZeros from '../../utils/removeZerosMat';
import calculateDisinfScore from '../../utils/calcDisinfScore';
import calculateStats from '../../utils/calcStats';


class ShowOperatorStats extends Component {
  state = {
    // orders that operator accepted
    orders: this.props.operator.stats.sortedOrders
  };

  render() {

    // calculate statistics
    let {
      totalSum,
      totalScore,
      totalOrders,
      // completed,
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
    } = calculateStats(this.state.orders);

    let totalConsumption = [];

    // let confirmedOrders = [],
    //   operatorDecidedOrders = [],
    //   rejectedOrders = [],
    //   failedOrders = 0,
    //   totalScore = 0,
    //   totalSum = 0,
    //   totalConsumption = [];

    materials.forEach(item => {
      let emptyObject = {
        material: item.material,
        amount: 0,
        unit: item.unit
      };
      totalConsumption.push(emptyObject);
    });

    this.state.orders.forEach(order => {

      // if (order.completed && order.operatorDecided) {
      //   operatorDecidedOrders.push(order);

      //   if (order.operatorConfirmed && (order.adminConfirmed || order.accountantConfirmed)) {
      //     confirmedOrders.push(order);
      //     totalSum += order.cost / order.disinfectors.length;
      //     totalScore += order.score;
      //   }

      //   if (order.clientType === 'corporate') {
      //     if (!order.operatorConfirmed || (order.accountantDecided && !order.accountantConfirmed)) {
      //       rejectedOrders.push(order);
      //     }
      //   } else if (order.clientType === 'individual') {
      //     if (!order.operatorConfirmed || (order.adminDecided && !order.adminConfirmed)) {
      //       rejectedOrders.push(order);
      //     }
      //   }
      // }

      // if (order.failed) {
      //   failedOrders++;
      // }

      // calculate total consumption of all orders accepted by operator in given period
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

    return (
      <div className="row">
        <div className="col-lg-4 col-md-6">
          <div className="card order mt-2">
            <div className="card-body p-0">
              <h4 className="text-center">Заказы, которые вы приняли:</h4>
              <ul className="font-bold mb-0 list-unstyled">
                <li>Принятые Заказов: {totalOrders}</li>
                <li>Выполнено и Подтверждено Заказов: {confirmedOrders.length}</li>
                <li>Общая Сумма: {totalSum.toLocaleString()} UZS</li>
                {/* <li>Средний балл: {(totalScore / confirmedOrders.length).toFixed(2)} (из 5)</li> */}
                <li className="pb-2">Средний балл: {averageScore} (из 5)</li>
                <li>Отвергнутые заказы: {rejected}</li>
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
              <h4 className="text-center">Общий Расход Материалов Заказов:</h4>
              <ul className="font-bold mb-0 pl-3">
                {renderTotalConsumption}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  operator: state.operator,
  errors: state.errors
});

export default connect(mapStateToProps)(withRouter(ShowOperatorStats));