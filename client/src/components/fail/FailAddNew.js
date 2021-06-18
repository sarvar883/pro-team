import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import orderTypes from '../common/orderTypes';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';

import { getFailOrderById, setFailedOrder, createOrderAfterFail } from '../../actions/failActions';
import { getAllUsers } from '../../actions/orderActions';


class FailAddNew extends Component {
  state = {
    date: '',
    timeFrom: '',
    disinfectorId: '',
    typeOfService: [],
    comment: '',
    errors: {}
  };

  componentDidMount() {
    this.props.getAllUsers();
    window.scrollTo({ top: 0 });

    // console.log('fail', this.props.location.state);

    // in some cases, we should load order because the fields userCreated, userAcceptedOrder, disinfectors.user should be populated
    // if we come to this page from /search-orders, these fields would not be populated
    if (this.props.location.state && !this.props.location.state.state.shouldLoadOrder) {
      this.props.setFailedOrder(this.props.location.state.state.order);
    } else {
      this.props.getFailOrderById(this.props.match.params.id);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let array = [];
    orderTypes.forEach(object => {
      array.push({
        type: object.value,
        selected: false
      });
    });

    if (nextProps.fail.failedOrder) {
      // service type array. typeOfService options should be preselected
      let arraySelectedItems = [];
      if (nextProps.fail.failedOrder.typeOfService) {
        arraySelectedItems = nextProps.fail.failedOrder.typeOfService.split(',');
      }

      array.forEach(item => {
        arraySelectedItems.forEach(element => {
          if (item.type === element.trim()) {
            item.selected = true;
          }
        });
      });

      // set typeOfService and comment
      this.setState({
        comment: nextProps.fail.failedOrder.comment,
        typeOfService: array
      });
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onChangeTypes = (e) => {
    let array = [...this.state.typeOfService];
    array.forEach(item => {
      if (item.type === e.target.value) {
        item.selected = e.target.checked;
      }
    });

    this.setState({
      typeOfService: array
    });
  }

  onSubmit = (e) => {
    e.preventDefault();

    const date = this.state.date.split('-');
    const dateStringFrom = new Date(`${date[1]}-${date[2]}-${date[0]} ${this.state.timeFrom}`);

    let serviceTypeString = '', selectedItems = 0;
    this.state.typeOfService.forEach(item => {
      if (item.selected) {
        selectedItems++;
        if (selectedItems === 1) {
          serviceTypeString = serviceTypeString + item.type;
        } else {
          serviceTypeString = serviceTypeString + ',' + item.type;
        }
      }
    });

    // check if prderTypes are selected
    if (selectedItems === 0) {
      alert('Выберите тип заказа');
    } else {
      const object = {
        // who is filling this form
        userOccupation: this.props.auth.user.occupation,

        // previous failed order
        failedOrder: this.props.fail.failedOrder,

        // new order details
        newOrder: {
          disinfectorId: this.state.disinfectorId,
          date: this.state.date,
          dateFrom: dateStringFrom,
          timeFrom: this.state.timeFrom,
          typeOfService: serviceTypeString,
          comment: this.state.comment,
          userCreated: this.props.auth.user.id
        }
      };
      // console.log('object', object);
      this.props.createOrderAfterFail(object, this.props.history, this.props.auth.user.occupation);
    }
  }

  render() {
    const { errors } = this.state;

    const order = this.props.fail.failedOrder;

    // console.log('ORDER', order);

    // consumption array of specific order
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

    // all users
    let users = this.props.order.loading ? [] : this.props.order.allUsers;

    // get disinfectors and subadmins
    let disinfectors = users.filter(user => user.occupation === 'disinfector' || user.occupation === 'subadmin');

    const disinfectorOptions = [
      { label: '-- Выберите ответственного дезинфектора --', value: '' }
    ];
    disinfectors.forEach(worker => disinfectorOptions.push({
      label: `${worker.name}, ${worker.occupation}`, value: worker._id
    }));


    let renderServiceTypes = this.state.typeOfService.map((item, key) =>
      <div className="form-check" key={key}>
        <label className="form-check-label">
          {item.selected ?
            <React.Fragment>
              <input type="checkbox" defaultChecked="checked" className="form-check-input" onChange={this.onChangeTypes} value={item.type} />{item.type}
            </React.Fragment> :
            <React.Fragment>
              <input type="checkbox" className="form-check-input" onChange={this.onChangeTypes} value={item.type} />{item.type}
            </React.Fragment>}
        </label>
      </div>
    );


    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center">Клиент недоволен. Добавить новый заказ</h2>
          </div>
        </div>

        {this.props.fail.loading ? <Spinner /> : (
          <div className="row mt-2">
            <div className="col-md-6 col-sm-10 mt-3">
              <div className="card order mt-2">
                <div className="card-body p-0">
                  <ul className="font-bold mb-0 list-unstyled">
                    {order.prevFailedOrder && (
                      <li><h4><i className="fas fas fa-exclamation"></i> Повторный заказ <i className="fas fas fa-exclamation"></i></h4></li>
                    )}

                    {order.failed && (
                      <li><h4><i className="fas fas fa-exclamation"></i> Некачественный заказ <i className="fas fas fa-exclamation"></i></h4></li>
                    )}

                    {order.disinfectorId ? (
                      <li>Ответственный: {order.disinfectorId.occupation} {order.disinfectorId.name}</li>
                    ) : ''}


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


                    {order.prevFailedOrder && order.prevFailedOrder.disinfectorId && (
                      <li className="text-primary">Предыдущий некачественный заказ: <Moment format="DD/MM/YYYY HH:mm">{order.prevFailedOrder.dateFrom}</Moment> ({order.prevFailedOrder.disinfectorId.occupation} {order.prevFailedOrder.disinfectorId.name})</li>
                    )}



                    {order.completed ? (
                      <li>Заказ Выполнен</li>
                    ) : <li>Заказ еще Не Выполнен</li>}

                    {order.completed && order.operatorDecided ? (
                      <React.Fragment>
                        <li>Оператор рассмотрел заявку</li>
                        {order.operatorConfirmed ? <li className="text-success">Оператор подтвердил заяку (время: <Moment format="DD/MM/YYYY HH:mm">{order.operatorCheckedAt}</Moment>)</li> : <li className="text-danger">Оператор отверг заяку (время: <Moment format="DD/MM/YYYY HH:mm">{order.operatorCheckedAt}</Moment>)</li>}
                        <li>Балл: {order.score}</li>
                        <li>Отзыв Клиента: {order.clientReview}</li>
                      </React.Fragment>
                    ) : <li>Оператор еще не рассмотрел заявку</li>}









                    {order.accountantDecided ? (
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
                            <li>Общая Сумма: {order.cost.toLocaleString()} (каждому по {(order.cost / order.disinfectors.length).toLocaleString()})</li>
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

                    {order.clientType === 'individual' ? (
                      <React.Fragment>
                        {order.completed && order.adminDecided ? (
                          <React.Fragment>
                            <li>Админ рассмотрел заявку (время: <Moment format="DD/MM/YYYY HH:mm">{order.adminCheckedAt}</Moment>)</li>
                            {order.adminConfirmed ? <li className="text-success">Админ подтвердил заяку</li> : <li className="text-danger">Админ отверг заяку</li>}
                          </React.Fragment>
                        ) : <li>Админ еще не рассмотрел заявку</li>}
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

                    <li className="text-danger">Телефон Клиента: {order.phone}</li>
                    {order.phone2 ? <li>Другой номер: {order.phone2}</li> : ''}
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
                            {order.cost && <li>Общая Сумма: {order.cost.toLocaleString()} UZS (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>}
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

                    <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{order.completedAt}</Moment></li>
                  </ul>
                </div>
              </div>
            </div>


            <div className="col-md-6 col-sm-10 mt-3">
              <div className="card">
                <div className="card-body py-1">
                  <h3 className="text-center mt-3">Создать Новый Заказ</h3>
                  <form onSubmit={this.onSubmit}>

                    {this.props.order.loading ? (
                      <p>Дезинфекторы загружаются...</p>
                    ) : (
                      <div className="form-group">
                        <label htmlFor="disinfectorId">Выберите Дезинфектора:</label>
                        <select
                          className="form-control"
                          name="disinfectorId"
                          value={this.state.disinfectorId}
                          onChange={this.onChange}
                          required
                        >
                          {disinfectorOptions.map((item, index) =>
                            <option key={index} value={item.value}>{item.label}</option>
                          )}
                        </select>
                      </div>
                    )}

                    <TextFieldGroup
                      label="Дата выполнения заказа"
                      name="date"
                      type="date"
                      value={this.state.date}
                      onChange={this.onChange}
                      error={errors.date}
                      required
                    />
                    <TextFieldGroup
                      label="Время (часы:минуты:AM/PM)"
                      name="timeFrom"
                      type="time"
                      value={this.state.timeFrom}
                      onChange={this.onChange}
                      error={errors.timeFrom}
                      required
                    />

                    <div className="border-bottom"></div>
                    <label htmlFor="typeOfService">Выберите тип заказа (можно выбрать несколько):</label>
                    {renderServiceTypes}
                    <div className="border-bottom"></div>

                    <label htmlFor="comment">Введите Комментарии (это поле необязательное):</label>
                    <TextAreaFieldGroup
                      name="comment"
                      placeholder="Комментарии (Это поле не обязательное)"
                      value={this.state.comment}
                      onChange={this.onChange}
                      error={errors.comment}
                    />
                    <button type="submit" className="btn btn-success">Создать</button>
                  </form>
                </div>
              </div>
            </div>


          </div>
        )}
      </div>
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

export default connect(mapStateToProps, { getAllUsers, getFailOrderById, setFailedOrder, createOrderAfterFail })(withRouter(FailAddNew));