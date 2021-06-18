import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import TextFieldGroup from '../common/TextFieldGroup';
// import guaranteeExpired from '../../utils/guaranteeExpired';
import ClientNotSatisfiedButton from '../common/ClientNotSatisfiedButton';

import { searchOrders, deleteOrder } from '../../actions/orderActions';
import { adminConfirmsOrderQuery } from '../../actions/adminActions';


class SearchOrders extends Component {
  state = {
    phone: '',
    address: '',
    contractNumber: '',
    method: '',
    headingText: '',
    orders: []
  };

  componentDidMount() {
    if (this.props.order.orders && this.props.order.orders.length > 0) {
      this.setState({
        orders: this.props.order.orders,
        method: this.props.order.searchOrderMethod,
        headingText: this.props.order.searchOrderInput
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      orders: nextProps.order.orders
    });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  searchByAddress = (e) => {
    e.preventDefault();
    this.setState({
      method: 'address',
      headingText: this.state.address
    });
    const object = {
      method: 'address',
      payload: this.state.address
    };
    this.props.searchOrders(object);
  };

  searchByPhone = (e) => {
    e.preventDefault();
    this.setState({
      method: 'phone',
      headingText: this.state.phone
    });
    const object = {
      method: 'phone',
      payload: this.state.phone
    };
    this.props.searchOrders(object);
  };

  searchByContract = (e) => {
    e.preventDefault();
    this.setState({
      method: 'contract',
      headingText: this.state.contractNumber
    });
    const object = {
      method: 'contract',
      payload: this.state.contractNumber
    };
    this.props.searchOrders(object);
  };

  adminConfirm = (orderId, response, disinfectors) => {
    const object = {
      orderId: orderId,
      response: response,
      disinfectors: disinfectors
    };
    this.props.adminConfirmsOrderQuery(object, this.props.history);
  };

  // delete order
  deleteOrder = (id, clientType, clientPhone, clientId, orderDateFrom) => {
    const object = {
      id: id,
      clientType: clientType,
      clientPhone: clientPhone,
      clientId: clientId,
      orderDateFrom: orderDateFrom,
    };
    this.props.deleteOrder(object, this.props.history, this.props.auth.user.occupation);
    window.location.reload();
  }

  // goToAddNewForm = (item) => {
  //   this.props.history.push(`/fail/add-new/${item._id}`, {
  //     pathname: `/fail/add-new/${item._id}`,
  //     state: { order: item, shouldLoadOrder: true }
  //   });
  // };

  render() {
    console.log('orders', this.state.orders);
    let renderOrders = this.state.orders.map((item, index) => {
      let consumptionArray = [];
      item.disinfectors.forEach(thing => {
        consumptionArray.push({
          user: thing.user,
          consumption: thing.consumption
        });
      });


      // let consumptionRender = consumptionArray.map((element, number) =>
      //   <li key={number}>
      //     <p className="mb-0">Пользователь: {element.user.occupation} {element.user.name}</p>
      //     {element.consumption.map((thing, key) =>
      //       <p key={key} className="mb-0">{thing.material}: {thing.amount.toLocaleString()} {thing.unit}</p>
      //     )}
      //   </li>
      // );


      return (
        <div className="col-lg-4 col-md-6" key={index}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 list-unstyled">
                {item.prevFailedOrder && (
                  <li><h4><i className="fas fas fa-exclamation"></i> Повторный заказ <i className="fas fas fa-exclamation"></i></h4></li>
                )}

                {item.failed && (
                  <li><h4><i className="fas fas fa-exclamation"></i> Некачественный заказ <i className="fas fas fa-exclamation"></i></h4></li>
                )}

                {item.disinfectorId && (
                  <li>Ответственный: {item.disinfectorId.occupation} {item.disinfectorId.name}</li>
                )}

                {/* {item.completed ? (
                  <li>Заказ Выполнен</li>
                ) : <li>Заказ еще Не Выполнен</li>} */}

                {!item.completed && <li>Заказ еще Не Выполнен</li>}

                {item.completed && item.operatorDecided ? (
                  <React.Fragment>
                    <li>Оператор рассмотрел заявку</li>
                    {item.operatorConfirmed ? <li className="text-success">Оператор подтвердил заяку (время: <Moment format="DD/MM/YYYY HH:mm">{item.operatorCheckedAt}</Moment>)</li> : <li className="text-danger">Оператор отверг заяку (время: <Moment format="DD/MM/YYYY HH:mm">{item.operatorCheckedAt}</Moment>)</li>}
                    <li>Балл: {item.score}</li>
                    <li>Отзыв Клиента: {item.clientReview}</li>
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


                {/* {item.clientType === 'corporate' && item.paymentMethod === 'notCash' && !item.accountantDecided ? <li>Бухгалтер еще не рассмотрел заявку</li> : ''}

                {item.clientType === 'corporate' && item.paymentMethod === 'notCash' && item.accountantDecided ?
                  <React.Fragment>
                    <li>Бухгалтер рассмотрел заявку</li>
                    {item.accountantConfirmed ? (
                      <React.Fragment>
                        <li className="text-success">Бухгалтер Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{item.accountantCheckedAt}</Moment>)</li>
                        <li>Счет-Фактура: {item.invoice}</li>
                        <li>Общая Сумма: {item.cost.toLocaleString()} (каждому по {(item.cost / item.disinfectors.length).toLocaleString()})</li>
                      </React.Fragment>
                    ) : <li className="text-danger">Бухгалтер Отклонил (<Moment format="DD/MM/YYYY HH:mm">{item.accountantCheckedAt}</Moment>)</li>}
                  </React.Fragment>
                  : ''}

                {item.clientType === 'corporate' && item.paymentMethod === 'cash' && !item.adminDecided ? <li>Админ еще не рассмотрел заявку</li> : ''}

                {item.clientType === 'corporate' && item.paymentMethod === 'cash' && item.adminDecided ? (
                  <React.Fragment>
                    <li>Админ рассмотрел заявку</li>
                    {item.adminConfirmed ? (
                      <li className="text-success">Админ Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{item.adminCheckedAt}</Moment>)</li>
                    ) : <li className="text-danger">Админ Отклонил (<Moment format="DD/MM/YYYY HH:mm">{item.adminCheckedAt}</Moment>)</li>}
                  </React.Fragment>
                ) : ''}

                {item.clientType === 'individual' ? (
                  <React.Fragment>
                    {item.completed && item.adminDecided ? (
                      <React.Fragment>
                        <li>Админ рассмотрел заявку (время: <Moment format="DD/MM/YYYY HH:mm">{item.adminCheckedAt}</Moment>)</li>
                        {item.adminConfirmed ? <li className="text-success">Админ подтвердил заяку</li> : <li className="text-danger">Админ отверг заяку</li>}
                      </React.Fragment>
                    ) : <li>Админ еще не рассмотрел заявку</li>}
                  </React.Fragment>
                ) : ''} */}














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

                <li className="text-danger">Телефон: {item.phone}</li>
                {item.phone2 && item.phone2 !== '' ? <li className="text-danger">Запасной номер: {item.phone2}</li> : ''}
                <li className="text-danger">Адрес: {item.address}</li>

                {/* <li className="text-danger">Откуда узнали: {item.advertising}</li> */}

                <li className="text-danger">Тип услуги: {item.typeOfService}</li>

                {item.dateFrom ? (
                  <React.Fragment>
                    <li>Дата: <Moment format="DD/MM/YYYY">{item.dateFrom}</Moment></li>
                    {item.completed ? (
                      <li>Время выполнения: С <Moment format="HH:mm">{item.dateFrom}</Moment> ПО <Moment format="HH:mm">{item.completedAt}</Moment></li>
                    ) : <li>Время выполнения: <Moment format="HH:mm">{item.dateFrom}</Moment></li>}
                  </React.Fragment>
                ) : <li>Дата и время выполнения: --</li>}

                {item.clientType === 'corporate' ? (
                  <li>Номер договора: {item.contractNumber ? item.contractNumber : '--'}</li>
                ) : ''}

                <li>Срок гарантии (в месяцах): {item.guarantee}</li>
                <li>Комментарии: {item.comment ? item.comment : '--'}</li>
                <li>Комментарии Дезинфектора: {item.disinfectorComment ? item.disinfectorComment : '--'}</li>

                {/* {item.completed ? (
                  <React.Fragment>
                    <li>Расход Материалов:</li>
                    <ul className="font-bold mb-0">
                      {consumptionRender}
                    </ul>
                  </React.Fragment>
                ) : <li>Расход Материалов: --</li>} */}

                {/* {item.repeatedOrder ? (
                  <React.Fragment>
                    <li className="mt-2">Это повторная продажа</li>
                    {item.repeatedOrderDecided ? (
                      <React.Fragment>
                        <li>Решение по проведению повторной работы принято</li>
                        {item.repeatedOrderNeeded ? (
                          <li>Повторная продажа будет проведена</li>
                        ) : (
                            <li>Повторная продажа не требуется</li>
                          )}
                      </React.Fragment>
                    ) : (
                        <li>Решение по проведению повторной продажи еще не принято</li>
                      )}
                  </React.Fragment>
                ) : ''} */}

                {item.completed ? (
                  <Link
                    to={`/order-full-details/${item._id}`}
                    className="btn btn-primary mt-3 mr-2"
                  >
                    <i className="fas fa-info"></i> Подробнее
                  </Link>
                ) : (
                  <Link
                    to={`/order-details/${item._id}`}
                    className="btn btn-primary mt-3 mr-2"
                  >
                    <i className="fas fa-info"></i> Подробнее
                  </Link>
                )}


                {/* {this.props.auth.user.occupation === 'admin' && item.completed && !item.adminDecided ? (
                  <React.Fragment>
                    {item.clientType === 'individual' || (item.clientType === 'corporate' && item.paymentMethod === 'cash') ? (
                      <div className="btn-group">
                        <button className="btn btn-danger mt-2 mr-2" onClick={() => { if (window.confirm('Вы уверены отменить заказ?')) { this.adminConfirm(item._id, 'false') } }}>Отменить</button>

                        <button className="btn btn-success mt-2 mr-2" onClick={() => { if (window.confirm('Вы уверены подтвердить заказ?')) { this.adminConfirm(item._id, 'true') } }}>Подтвердить</button>

                        <button className="btn btn-dark mt-2 mr-2" onClick={() => { if (window.confirm('Вы уверены отправить заказ обратно дезинфектору?')) { this.adminConfirm(item._id, 'back', item.disinfectors) } }}>Обратно</button>
                      </div>
                    ) : ''}
                  </React.Fragment>
                ) : ''} */}


                {this.props.auth.user.occupation === 'accountant' &&
                  item.completed &&
                  !item.accountantDecided &&
                  !item.adminDecided ? (
                  // item.clientType === 'corporate' && 
                  // item.paymentMethod === 'notCash' ? (
                  <Link
                    to={`/accountant/order-confirm/${item._id}`}
                    className="btn btn-dark mt-3 mr-2"
                  >
                    <i className="fab fa-wpforms"></i> Перейти на страницу подтверждения
                  </Link>
                ) : ''}


                {this.props.auth.user.occupation === 'operator' &&
                  item.completed && !item.operatorDecided ? (
                  <Link
                    to={`/order-confirm/${item._id}`}
                    className="btn btn-dark mt-3 mr-2"
                  >
                    <i className="fab fa-wpforms"></i> Перейти на страницу подтверждения
                  </Link>
                ) : ''}

                {/* <button className="btn btn-danger" onClick={() => {
                  if (window.confirm('Вы уверены?')) {
                    if (item.clientType === 'corporate') {
                      this.deleteOrder(item._id, item.clientType, item.phone, item.clientId._id, item.dateFrom);
                    } else if (item.clientType === 'individual') {
                      this.deleteOrder(item._id, item.clientType, item.phone, '', item.dateFrom);
                    }
                  }
                }}>Удалить</button> */}

                {/* show клиент недоволен button */}
                {/* {['admin', 'accountant', 'subadmin', 'operator'].includes(this.props.auth.user.occupation) &&
                  item.completed && !item.failed && item.guarantee &&
                  !guaranteeExpired(item.completedAt, item.guarantee) ? (

                  <div className="btn-group">
                    <button
                      className="btn btn-secondary mt-2 mr-2"
                      onClick={() => this.goToAddNewForm(item)}
                    >Клиент Недоволен</button>
                  </div>

                ) : ''} */}

                <ClientNotSatisfiedButton
                  order={item}
                  shouldLoadOrder={true}
                />

              </ul>
            </div>
          </div>
        </div>
      )
    });

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center">Поиск заказов</h2>
          </div>
        </div>
        <div className="row">

          <div className="col-lg-4 col-md-6 mt-2">
            <form onSubmit={this.searchByAddress} className="form-bg p-1">
              <h4 className="text-center mb-0">Поиск по адресу <i className="fas fa-map-marker"></i></h4>
              <TextFieldGroup
                type="text"
                placeholder="Адрес"
                name="address"
                value={this.state.address}
                onChange={this.onChange}
                required
              />
              <button type="submit" className="btn btn-success"><i className="fas fa-search"></i> Искать</button>
            </form>
          </div>

          <div className="col-lg-4 col-md-6 mt-2">
            <form onSubmit={this.searchByPhone} className="form-bg p-1">
              <h4 className="text-center mb-0">Поиск по номеру телефона <i className="fas fa-phone"></i></h4>
              <TextFieldGroup
                type="text"
                placeholder="Номер Телефона"
                name="phone"
                value={this.state.phone}
                onChange={this.onChange}
                required
              />
              <button type="submit" className="btn btn-dark"><i className="fas fa-search"></i> Искать</button>
            </form>
          </div>

          <div className="col-lg-4 col-md-6 mt-2">
            <form onSubmit={this.searchByContract} className="form-bg p-1">
              <h4 className="text-center mb-0">Поиск по номеру договора <i className="fas fa-file-alt"></i></h4>
              <TextFieldGroup
                type="text"
                placeholder="Номер Договора"
                name="contractNumber"
                value={this.state.contractNumber}
                onChange={this.onChange}
                required
              />
              <button type="submit" className="btn btn-primary"><i className="fas fa-search"></i> Искать</button>
            </form>
          </div>

        </div>

        <div className="row mt-3">
          <div className="col-12">
            {this.state.method === 'phone' && (
              <h2 className="text-center">Результаты поиска заказов по номеру телефона "{this.state.headingText}"</h2>
            )}

            {this.state.method === 'address' && (
              <h2 className="text-center">Результаты поиска заказов по адресу "{this.state.headingText}"</h2>
            )}

            {this.state.method === 'contract' && (
              <h2 className="text-center">Результаты поиска заказов по номеру договора "{this.state.headingText}"</h2>
            )}
          </div>
        </div>

        {this.props.order.loading ? (
          <div className="row mt-3">
            <div className="col-12">
              <Spinner />
            </div>
          </div>
        ) : (
          <div className="row mt-3">
            {this.state.headingText.length > 0 && this.props.order.orders.length === 0 ? (
              <h2 className="m-auto">Заказы не найдены</h2>
            ) : renderOrders}
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
  accountant: state.accountant,
  operator: state.operator,
  order: state.order,
  errors: state.errors
});

export default connect(mapStateToProps, { searchOrders, adminConfirmsOrderQuery, deleteOrder })(withRouter(SearchOrders));