import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// import Moment from 'react-moment';

// import materials from '../common/materials';
import removeZeros from '../../utils/removeZerosMat';
import calculateStats from '../../utils/calcStats';
import calcMaterialConsumption from '../../utils/calcMatConsumption';

class ShowAccStats extends Component {
  state = {
    // orders of only corporate clients
    orders: this.props.accountant.stats.orders
  };

  render() {
    // let confirmedOrders = [],
    //   operatorDecidedOrders = [],
    //   rejectedOrders = [],
    //   failedOrders = 0,
    //   totalScore = 0,
    //   totalSum = 0;

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
    } = calculateStats(this.state.orders);

    // let totalConsumption = [];
    // materials.forEach(item => {
    //   let emptyObject = {
    //     material: item.material,
    //     amount: 0,
    //     unit: item.unit
    //   };
    //   totalConsumption.push(emptyObject);
    // });

    // this.state.orders.forEach(order => {
    // if (order.completed && order.operatorDecided) {
    //   operatorDecidedOrders.push(order);

    //   if (order.operatorConfirmed && (order.adminConfirmed || order.accountantConfirmed)) {
    //     confirmedOrders.push(order);
    //     totalSum += order.cost;
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


    // // calculate total consumption of all orders accepted by operator in given period
    // order.disinfectors.forEach(element => {
    //   element.consumption.forEach(object => {
    //     totalConsumption.forEach(item => {
    //       if (object.material === item.material && object.unit === item.unit) {
    //         item.amount += object.amount;
    //       }
    //     });
    //   });
    // });
    // });



    // не считать расходы материалов у повторных и некачественных заказов (нужно учесть)
    // заказ, который не является некачественным и не является повторным
    let approvedOrders = this.state.orders.filter(order =>
      order.completed &&
      !order.failed &&
      !order.hasOwnProperty('prevFailedOrder')
    );

    // calculate total consumption of all orders accepted by operator in given period
    // let totalConsumption = calcMaterialConsumption(this.state.orders);
    let totalConsumption = calcMaterialConsumption(approvedOrders);

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
              <h4 className="text-center">Заказы корпоративных клиентов</h4>
              <ul className="font-bold mb-0 list-unstyled">
                <li>Всего Получено Заказов: {totalOrders}</li>
                <li>Выполнено Заказов: {completed}</li>
                <li>Подтверждено Заказов: {confirmedOrders.length} (из них Консультации и Осмотры: {consultAndOsmotrConfirmed})</li>

                <li className="pt-2">Общая Сумма: {totalSum.toLocaleString()} UZS</li>
                <li className="pb-2">Средний балл: {(totalScore / confirmedOrders.length).toFixed(2)} (из 5)</li>

                <li>Отвергнутые заказы: {rejected}</li>
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
              <h4 className="text-center">Общий Расход Материалов Этих Заказов</h4>
              <ul className="font-bold mb-0 list-unstyled">
                {renderTotalConsumption}

                <h6 className="mt-2">* сюда не входят некачественные и повторные заказы</h6>
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
  accountant: state.accountant,
  errors: state.errors
});

export default connect(mapStateToProps)(withRouter(ShowAccStats));