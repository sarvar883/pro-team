import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';

import ClientNotSatisfiedButton from '../common/ClientNotSatisfiedButton';
import { getCompleteOrderById, confirmCompleteOrder } from '../../actions/operatorActions';


class ConfirmOrder extends Component {
  state = {
    clientReview: '',
    score: '',
    errors: {}
  };

  componentDidMount() {
    this.props.getCompleteOrderById(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();

    if (this.state.clientReview === '') {
      return alert('Введите отзыв клиента');
    }

    const object = {
      orderId: this.props.operator.orderToConfirm._id,
      decision: 'confirm',
      clientReview: this.state.clientReview,
      score: this.state.score
    };
    this.props.confirmCompleteOrder(object, this.props.history);
  }

  reject = () => {
    const object = {
      orderId: this.props.operator.orderToConfirm._id,
      decision: 'reject',
      clientReview: '',
      score: ''
    };
    this.props.confirmCompleteOrder(object, this.props.history);
  }

  // goToAddNewForm = (order) => {
  //   this.props.history.push(`/fail/add-new/${order._id}`, {
  //     pathname: `/fail/add-new/${order._id}`,
  //     state: { order }
  //   });
  // };

  render() {
    const completeOrder = this.props.operator.orderToConfirm;
    const { errors } = this.state;

    let consumptionArray = [];
    completeOrder.disinfectors.forEach(item => {
      consumptionArray.push({
        user: item.user,
        consumption: item.consumption
      });
    });

    let consumptionRender = consumptionArray.map((item, index) =>
      <li key={index}>
        <p className="mb-0">Пользователь: {item.user.occupation} {item.user.name}</p>
        {item.consumption.map((element, number) =>
          <p key={number} className="mb-0">{element.material}: {element.amount.toLocaleString()} {element.unit}</p>
        )}
      </li>
    );

    return (
      <div className="container-fluid">
        <div className="row">

          <div className="col-lg-6 col-md-9 mx-auto">
            {this.props.operator.loadingCompleteOrders ? <Spinner /> : (
              <React.Fragment>
                <h3 className="text-center">Выполненный Заказ</h3>
                <div className="card order mt-2">
                  <div className="card-body p-0">
                    <ul className="font-bold mb-0 list-unstyled">
                      {completeOrder.prevFailedOrder && (
                        <li><h4><i className="fas fas fa-exclamation"></i> Повторный заказ <i className="fas fas fa-exclamation"></i></h4></li>
                      )}

                      {completeOrder.failed && (
                        <li><h4><i className="fas fas fa-exclamation"></i> Некачественный заказ <i className="fas fas fa-exclamation"></i></h4></li>
                      )}

                      {completeOrder.disinfectorId && (
                        <li>Ответственный: {completeOrder.disinfectorId.occupation} {completeOrder.disinfectorId.name}</li>
                      )}


                      {completeOrder.failed && completeOrder.nextOrdersAfterFailArray && (
                        <React.Fragment>
                          <li className="text-primary">Повторов у этого заказа: {completeOrder.nextOrdersAfterFailArray.length}</li>

                          {completeOrder.nextOrdersAfterFailArray.length > 0 && (
                            <React.Fragment>
                              <li className="text-primary">Время последнего заказа: <Moment format="DD/MM/YYYY HH:mm">{completeOrder.nextOrdersAfterFailArray[completeOrder.nextOrdersAfterFailArray.length - 1].dateFrom}</Moment></li>

                              <li className="text-primary">Выполняет последний заказ: {completeOrder.nextOrdersAfterFailArray[completeOrder.nextOrdersAfterFailArray.length - 1].disinfectorId.occupation} {completeOrder.nextOrdersAfterFailArray[completeOrder.nextOrdersAfterFailArray.length - 1].disinfectorId.name}</li>
                            </React.Fragment>
                          )}
                        </React.Fragment>
                      )}









                      {completeOrder.accountantDecided ? (
                        <React.Fragment>
                          <li>Бухгалтер рассмотрел заявку</li>
                          {completeOrder.accountantConfirmed ? (
                            <React.Fragment>
                              <li className="text-success">Бухгалтер Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{completeOrder.accountantCheckedAt}</Moment>)</li>
                              <li>Счет-Фактура: {completeOrder.invoice ? completeOrder.invoice : '--'}</li>
                              <li>Общая Сумма: {completeOrder.cost.toLocaleString()} UZS (каждому по {(completeOrder.cost / completeOrder.disinfectors.length).toLocaleString()} UZS)</li>
                            </React.Fragment>
                          ) : <li className="text-danger">Бухгалтер Отклонил (<Moment format="DD/MM/YYYY HH:mm">{completeOrder.accountantCheckedAt}</Moment>)</li>}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>

                          {completeOrder.adminDecided ? (
                            <React.Fragment>
                              <li>Админ рассмотрел заявку</li>
                              {completeOrder.adminConfirmed ? (
                                <li className="text-success">Админ Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{completeOrder.adminCheckedAt}</Moment>)</li>
                              ) : <li className="text-danger">Админ Отклонил (<Moment format="DD/MM/YYYY HH:mm">{completeOrder.adminCheckedAt}</Moment>)</li>}
                            </React.Fragment>
                          ) : (
                            <li>Бухгалтер еще не рассмотрел заявку</li>
                          )}

                        </React.Fragment>
                      )}



                      {/* {completeOrder.clientType === 'corporate' && completeOrder.paymentMethod === 'notCash' && !completeOrder.accountantDecided ? <li>Бухгалтер еще не рассмотрел заявку</li> : ''}

                    {completeOrder.clientType === 'corporate' && completeOrder.paymentMethod === 'notCash' && completeOrder.accountantDecided ?
                      <React.Fragment>
                        <li>Бухгалтер рассмотрел заявку</li>
                        {completeOrder.accountantConfirmed ? (
                          <React.Fragment>
                            <li className="text-success">Бухгалтер Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{completeOrder.accountantCheckedAt}</Moment>)</li>
                            <li>Счет-Фактура: {completeOrder.invoice}</li>
                            <li>Общая Сумма: {completeOrder.cost.toLocaleString()} (каждому по {(completeOrder.cost / completeOrder.disinfectors.length).toLocaleString()})</li>
                          </React.Fragment>
                        ) : <li className="text-danger">Бухгалтер Отклонил (<Moment format="DD/MM/YYYY HH:mm">{completeOrder.accountantCheckedAt}</Moment>)</li>}
                      </React.Fragment>
                      : ''}

                    {completeOrder.clientType === 'corporate' && completeOrder.paymentMethod === 'cash' && !completeOrder.adminDecided ? <li>Админ еще не рассмотрел заявку</li> : ''}

                    {completeOrder.clientType === 'corporate' && completeOrder.paymentMethod === 'cash' && completeOrder.adminDecided ? (
                      <React.Fragment>
                        <li>Админ рассмотрел заявку</li>
                        {completeOrder.adminConfirmed ? (
                          <li className="text-success">Админ Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{completeOrder.adminCheckedAt}</Moment>)</li>
                        ) : <li className="text-danger">Админ Отклонил (<Moment format="DD/MM/YYYY HH:mm">{completeOrder.adminCheckedAt}</Moment>)</li>}
                      </React.Fragment>
                    ) : ''} */}













                      {completeOrder.clientType === 'corporate' ?
                        <React.Fragment>
                          {completeOrder.clientId ? (
                            <li className="text-danger">Корпоративный Клиент: {completeOrder.clientId.name}</li>
                          ) : <li className="text-danger">Корпоративный Клиент</li>}
                          <li className="text-danger">Имя клиента: {completeOrder.client}</li>
                        </React.Fragment>
                        : ''}

                      {completeOrder.clientType === 'individual' ?
                        <li className="text-danger">Физический Клиент: {completeOrder.client}</li>
                        : ''}
                      <li className="text-danger">Дата: <Moment format="DD/MM/YYYY">{completeOrder.dateFrom}</Moment></li>
                      <li className="text-danger">Время выполнения: С <Moment format="HH:mm">{completeOrder.dateFrom}</Moment> ПО <Moment format="HH:mm">{completeOrder.completedAt}</Moment></li>
                      <li className="text-danger">Адрес: {completeOrder.address}</li>

                      <li className="text-danger">Телефон клиента: {completeOrder.phone}</li>
                      {completeOrder.phone2 !== '' ? <li className="text-danger">Запасной номер: {completeOrder.phone2}</li> : ''}
                      <li className="text-danger">Тип услуги: {completeOrder.typeOfService}</li>
                      <li>Срок гарантии (в месяцах): {completeOrder.guarantee}</li>

                      <li>Комментарии Оператора: {completeOrder.comment ? completeOrder.comment : '--'}</li>
                      <li>Комментарии Дезинфектора: {completeOrder.disinfectorComment ? completeOrder.disinfectorComment : '--'}</li>

                      <li>Расход Материалов (заказ выполнили {completeOrder.disinfectors.length} чел):</li>
                      <ul className="font-bold mb-0">
                        {consumptionRender}
                      </ul>

                      {completeOrder.clientType === 'corporate' ? (
                        <React.Fragment>
                          {completeOrder.paymentMethod === 'cash' ? (
                            <React.Fragment>
                              <li>Тип Платежа: Наличный</li>
                              <li>Общая Сумма: {completeOrder.cost.toLocaleString()} UZS (каждому по {(completeOrder.cost / completeOrder.disinfectors.length).toLocaleString()} UZS)</li>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <li>Тип Платежа: Безналичный</li>
                              <li>Номер Договора: {completeOrder.contractNumber || ''}</li>
                            </React.Fragment>
                          )}
                        </React.Fragment>
                      ) : ''}

                      {completeOrder.clientType === 'individual' ?
                        <li>Общая Сумма: {completeOrder.cost.toLocaleString()} UZS (каждому по {(completeOrder.cost / completeOrder.disinfectors.length).toLocaleString()} UZS)</li>
                        : ''}

                      {completeOrder.userAcceptedOrder ? (
                        <li>Заказ принял: {completeOrder.userAcceptedOrder.occupation} {completeOrder.userAcceptedOrder.name}</li>
                      ) : ''}

                      {completeOrder.userCreated ? (
                        <li>Заказ добавил: {completeOrder.userCreated.occupation} {completeOrder.userCreated.name}</li>
                      ) : ''}

                      <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{completeOrder.completedAt}</Moment></li>
                    </ul>

                    <div className="btn-group mt-3">
                      <button className="btn btn-danger mr-2" onClick={() => { if (window.confirm('Вы уверены отменить заказ?')) { this.reject() } }}><i className="fas fa-ban"></i> Отменить Выполнение Заказа</button>
                    </div>

                    {/* {!completeOrder.failed ? (
                      <div className="btn-group mt-3">
                        <button
                          className="btn btn-secondary mr-2"
                          onClick={() => this.goToAddNewForm(completeOrder)}
                        >Клиент Недоволен</button>
                      </div>
                    ) : ''} */}

                    <ClientNotSatisfiedButton
                      order={completeOrder}
                      shouldLoadOrder={true}
                    />
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>


          <div className="col-lg-6 col-md-9 mx-auto">
            <div className="card mt-3 mb-3">
              <div className="card-body p-2">
                <h3 className="text-center">Форма Подтверждения Заказа</h3>
                {/* <form noValidate onSubmit={this.onSubmit}> */}
                <form onSubmit={this.onSubmit}>

                  <TextFieldGroup
                    label="Полученный Балл за Выполнение Заказа (0-5):"
                    type="number"
                    name="score"
                    min="0"
                    max="5"
                    value={this.state.score}
                    onChange={this.onChange}
                    error={errors.score}
                    required={true}
                  />

                  <TextAreaFieldGroup
                    name="clientReview"
                    placeholder="Отзыв Клиента"
                    value={this.state.clientReview}
                    onChange={this.onChange}
                    error={errors.clientReview}
                  />

                  <button className="btn btn-success btn-block">
                    <i className="fas fa-check-square"></i> Подтвердить Выполнение Заказа
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  operator: state.operator,
  errors: state.errors
});

export default connect(mapStateToProps, { getCompleteOrderById, confirmCompleteOrder })(withRouter(ConfirmOrder));