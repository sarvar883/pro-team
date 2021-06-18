import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// import Moment from 'react-moment';

// import materials from '../common/materials';
import removeZeros from '../../utils/removeZerosMat';
import calculateDisinfScore from '../../utils/calcDisinfScore';
import calculateStats from '../../utils/calcStats';
import calcMaterialConsumption from '../../utils/calcMatConsumption';

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
                <li>Принятые Заказы: {totalOrders}</li>
                <li>Выполнено Заказов: {completed}</li>
                <li>Подтверждено Заказов: {confirmedOrders.length} (из них Консультации и Осмотры: {consultAndOsmotrConfirmed})</li>

                <li className="pt-2">Общая Сумма: {totalSum.toLocaleString()} UZS</li>
                <li className="pb-2">Средний балл: {averageScore.toFixed(2)} (из 5)</li>

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
  operator: state.operator,
  errors: state.errors
});

export default connect(mapStateToProps)(withRouter(ShowOperatorStats));