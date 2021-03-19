import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import { getQueriesForAdmin, adminConfirmsOrderQuery } from '../../actions/adminActions';

class ShowQueriesForAdmin extends Component {
  _isMounted = false;

  state = {
    orderQueries: []
  };

  componentDidMount() {
    this._isMounted = true;
    if (this.props.admin.orderQueries && this.props.admin.orderQueries.length > 0) {
      this.setState({
        orderQueries: this.props.admin.orderQueries
      });
    }
  }

  adminConfirmsOrderQuery = (orderId, response, disinfectors) => {
    const object = {
      orderId: orderId,
      response: response,
      disinfectors: disinfectors
    };
    this.props.adminConfirmsOrderQuery(object, this.props.history);
    window.location.reload();
  };

  goToAddNewForm = (order) => {
    this.props.history.push(`/fail/add-new/${order._id}`, {
      pathname: `/fail/add-new/${order._id}`,
      state: { order }
    });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let orderQueries = this.state.orderQueries.map((order, index) => {

      let consumptionArray = [];
      order.disinfectors.forEach(item => {
        consumptionArray.push({
          user: item.user,
          consumption: item.consumption
        });
      });

      let renderConsumptionOfOrder = consumptionArray.map((item, index) => {
        return (
          <li key={index}>
            <p className="mb-0">Пользователь: {item.user.occupation} {item.user.name}</p>
            {item.consumption.map((element, number) =>
              <p key={number} className="mb-0">{element.material}: {element.amount.toLocaleString()} {element.unit}</p>
            )}
          </li>
        );
      });

      return (
        <div className="col-lg-4 col-md-6 mt-3" key={index}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 pl-0 list-unstyled">
                {order.returnedBack ? (
                  <li className="text-danger">Это возвращенный заказ</li>
                ) : ''}

                {order.disinfectorId ? (
                  <li>Ответственный: {order.disinfectorId.occupation} {order.disinfectorId.name}</li>
                ) : ''}

                {order.failed && <li className="text-danger">Это некачественный заказ</li>}

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
                <li className="text-danger">Дата: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                <li className="text-danger">Время выполнения: С <Moment format="HH:mm">{order.dateFrom}</Moment> ПО <Moment format="HH:mm">{order.completedAt}</Moment></li>
                <li className="text-danger">Адрес: {order.address}</li>
                <li>Тип услуги: {order.typeOfService}</li>
                <li>Откуда узнали: {order.advertising}</li>
                <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{order.completedAt}</Moment></li>
                <li>Срок гарантии (в месяцах): {order.guarantee}</li>

                <li>Расход Материалов (заказ выполнили {order.disinfectors.length} чел):</li>
                <ul className="font-bold mb-0">
                  {renderConsumptionOfOrder}
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

                {order.clientType === 'individual' ?
                  <li>Общая Сумма: {order.cost.toLocaleString()} Сум (каждому по {(order.cost / order.disinfectors.length).toFixed(2).toLocaleString()} Сум)</li>
                  : ''}

                {order.userCreated ? (
                  <li>Добавил Заказ: {order.userCreated.occupation} {order.userCreated.name}</li>
                ) : ''}

                {order.userAcceptedOrder ? (
                  <li>Заказ принял: {order.userAcceptedOrder.occupation} {order.userAcceptedOrder.name}</li>
                ) : ''}

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
              </ul>

              <div className="btn-group mt-3">
                <button className="btn btn-danger mr-2" onClick={() => { if (window.confirm('Вы уверены отменить заказ?')) { this.adminConfirmsOrderQuery(order._id, 'false') } }}>Отменить</button>
              </div>

              <div className="btn-group mt-3">
                <button className="btn btn-success mr-2" onClick={() => { if (window.confirm('Вы уверены подтвердить заказ?')) { this.adminConfirmsOrderQuery(order._id, 'true') } }}>Подтвердить</button>
              </div>

              <div className="btn-group mt-3">
                <button className="btn btn-dark mr-2" onClick={() => { if (window.confirm('Вы уверены отправить заказ обратно дезинфектору?')) { this.adminConfirmsOrderQuery(order._id, 'back', order.disinfectors) } }}>Обратно</button>
              </div>

              {!order.failed ? (
                <div className="btn-group mt-3">
                  <button
                    className="btn btn-secondary mr-2"
                    onClick={() => this.goToAddNewForm(order)}
                  >Клиент Недоволен</button>
                </div>
              ) : ''}

            </div>
          </div>
        </div>
      )
    });

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-12">
            <h1 className="text-center">Выполненные Заказы</h1>
          </div>

          <div className="col-12">
            <button className="btn btn-primary" onClick={() => this.props.getQueriesForAdmin()}>Обновить запросы</button>
          </div>
          {orderQueries}
        </div>
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

export default connect(mapStateToProps, { getQueriesForAdmin, adminConfirmsOrderQuery })(withRouter(ShowQueriesForAdmin));