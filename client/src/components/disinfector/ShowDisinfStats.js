import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import materials from '../common/materials';
import removeZeros from '../../utils/removeZerosMat';
import calculateDisinfScore from '../../utils/calcDisinfScore';
import calculateStats from '../../utils/calcStats';


class ShowDisinfStats extends Component {
  state = {
    orders: this.props.disinfector.stats.orders,
    acceptedOrders: this.props.disinfector.stats.acceptedOrders,
    addedMaterials: this.props.disinfector.stats.addedMaterials
  };

  render() {

    // calculate statistics
    let {
      totalSum,
      totalScore,
      totalOrders,
      confirmedOrders,
      rejected,
      failed,
    } = calculateStats(this.state.orders);

    let totalConsumption = [], totalSumOfAcceptedOrders = 0;

    materials.forEach(item => {
      let emptyObject = {
        material: item.material,
        amount: 0,
        unit: item.unit
      };

      totalConsumption.push(emptyObject);
    });

    this.state.orders.forEach(order => {
      // calculate total consumption of all orders in given period of the logged in disinfector
      order.disinfectors.forEach(element => {
        if (element.user._id.toString() === this.props.auth.user.id) {
          element.consumption.forEach(object => {
            totalConsumption.forEach(item => {
              if (object.material === item.material && object.unit === item.unit) {
                item.amount += object.amount;
              }
            });
          });
        }
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

    this.state.acceptedOrders.forEach(order => {

      if (order.clientType === 'corporate') {
        if (order.completed && order.operatorConfirmed && order.accountantConfirmed) {
          totalSumOfAcceptedOrders += order.cost;
        }
      }

      if (order.clientType === 'individual') {
        if (order.completed && order.operatorConfirmed && order.adminConfirmed) {
          totalSumOfAcceptedOrders += order.cost;
        }
      }

    });


    // total received materials that disinfector received from admin in given period
    let totalReceivedMaterials = [];
    materials.forEach(item => {
      let emptyObject = {
        material: item.material,
        amount: 0,
        unit: item.unit
      };

      totalReceivedMaterials.push(emptyObject);
    });

    if (this.state.addedMaterials.length > 0) {
      this.state.addedMaterials.forEach(addEvent => {
        addEvent.materials.forEach(material => {
          totalReceivedMaterials.forEach(helpObject => {
            if (material.material === helpObject.material && material.unit === helpObject.unit) {
              helpObject.amount += material.amount;
            }
          });
        });
      });
    }

    let receivedMaterials = this.state.addedMaterials.map((item, index) => {
      let listItems = item.materials.map((thing, number) =>
        <li key={number}>{thing.material}: {thing.amount.toLocaleString()} {thing.unit}</li>
      );

      return (
        <div className="col-lg-4 col-md-6" key={index}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 pl-3">
                <li>Админ: {item.admin.name}</li>
                <li>Когда получено: <Moment format="DD/MM/YYYY HH:mm">{item.createdAt}</Moment></li>
                <h5 className="mb-0">Материалы:</h5>
                {listItems}
              </ul>
            </div>
          </div>
        </div>
      );
    });

    let renderTotalReceived = removeZeros(totalReceivedMaterials).map((item, index) =>
      <li key={index}>{item.material}: {item.amount.toLocaleString()} {item.unit}</li>
    );

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <h4 className="text-center">Заказы</h4>
                <ul className="font-bold mb-0 list-unstyled">
                  <li>Всего Получено Заказов: {totalOrders}</li>
                  <li>Выполнено и Подтверждено Заказов: {confirmedOrders.length}</li>

                  <li>Общая Сумма: {totalSum.toLocaleString()} UZS</li>
                  <li>Отвергнуто заказов: {rejected}</li>
                  <li>Некачественные заказы: {failed}</li>
                  <li className="pb-2">Средний балл: {averageScore} (из 5)</li>

                  <li>Принятые заказы: {this.state.acceptedOrders.length}</li>
                  <li>Общая сумма принятых заказов: {totalSumOfAcceptedOrders.toLocaleString()} UZS</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <h4 className="text-center">Общий Приход материалов за этот период:</h4>
                <ul className="font-bold mb-0 list-unstyled">
                  {renderTotalReceived}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <h4 className="text-center">Общий Расход Материалов за этот период:</h4>
                <ul className="font-bold mb-0 list-unstyled">
                  {renderTotalConsumption}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {this.state.addedMaterials.length > 0 ? (
          <React.Fragment>
            <div className="row mt-3">
              <div className="col-12">
                <h2 className="text-center pl-3 pr-3">Ваши полученные материалы за этот период</h2>
              </div>
            </div>

            <div className="row mt-2">
              {receivedMaterials}
            </div>
          </React.Fragment>
        ) : ''}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  disinfector: state.disinfector,
  errors: state.errors
});

export default connect(mapStateToProps)(withRouter(ShowDisinfStats));