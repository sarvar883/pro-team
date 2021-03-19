import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import materials from '../common/materials';
import removeZeros from '../../utils/removeZerosMat';

class ShowAccStats extends Component {
  state = {
    // orders of only corporate clients
    orders: this.props.accountant.stats.orders
  };

  render() {
    let confirmedOrders = [],
      operatorDecidedOrders = [],
      rejectedOrders = [],
      failedOrders = 0,
      totalScore = 0,
      totalSum = 0,
      totalConsumption = [];

    materials.forEach(item => {
      let emptyObject = {
        material: item.material,
        amount: 0,
        unit: item.unit
      };
      totalConsumption.push(emptyObject);
    });

    this.state.orders.forEach(order => {
      if (order.completed && order.operatorDecided) {
        operatorDecidedOrders.push(order);

        if (order.operatorConfirmed && (order.adminConfirmed || order.accountantConfirmed)) {
          confirmedOrders.push(order);
          totalSum += order.cost;
          totalScore += order.score;
        }

        if (order.clientType === 'corporate') {
          if (!order.operatorConfirmed || (order.accountantDecided && !order.accountantConfirmed)) {
            rejectedOrders.push(order);
          }
        } else if (order.clientType === 'individual') {
          if (!order.operatorConfirmed || (order.adminDecided && !order.adminConfirmed)) {
            rejectedOrders.push(order);
          }
        }
      }

      if (order.failed) {
        failedOrders++;
      }


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
              <h4 className="text-center">Заказы корпоративных клиентов:</h4>
              <ul className="font-bold mb-0 list-unstyled">
                <li>Всего Получено Заказов: {this.state.orders.length}</li>
                <li>Выполнено и Подтверждено Заказов: {confirmedOrders.length}</li>
                <li>Общая Сумма: {totalSum.toLocaleString()} UZS</li>
                <li>Средний балл: {(totalScore / confirmedOrders.length).toFixed(2)} (из 5)</li>
                <li>Отвергнутые заказы: {rejectedOrders.length}</li>
                <li>Некачественные заказы: {failedOrders}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="card order mt-2">
            <div className="card-body p-0">
              <h4 className="text-center">Общий Расход Материалов Этих Заказов:</h4>
              <ul className="font-bold mb-0 list-unstyled">
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
  accountant: state.accountant,
  errors: state.errors
});

export default connect(mapStateToProps, {})(withRouter(ShowAccStats));