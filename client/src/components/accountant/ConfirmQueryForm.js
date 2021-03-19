import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';
import TextFieldGroup from '../common/TextFieldGroup';

import { getCompleteOrderById, accountantConfirmQuery } from '../../actions/accountantActions';

class ConfirmQueryForm extends Component {
  state = {
    query: {
      disinfectorId: {},
      userCreated: {},
      clientId: {
        contracts: []
      },
      userAcceptedOrder: {},
      disinfectors: [],
      prevFailedOrder: {},
      nextOrderAfterFail: {}
    },
    invoice: '',
    cost: ''
  };

  componentDidMount() {
    this.props.getCompleteOrderById(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountant.queryById) {
      this.setState({
        query: nextProps.accountant.queryById
      });
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  confirmQueryFromCorporateClient = (e) => {
    e.preventDefault();
    if (Number(this.state.cost) <= 0) {
      alert('Сумма заказа не может быть нулем или отрицательным числом');
    } else {
      const object = {
        decision: 'confirm',
        clientType: this.state.query.clientType,
        paymentMethod: this.state.query.paymentMethod,
        orderId: this.state.query._id,
        invoice: this.state.invoice,
        cost: Number(this.state.cost),
        disinfectors: this.state.query.disinfectors
      };
      // console.log('corporate client', object);
      this.props.accountantConfirmQuery(object, this.props.history);
    }
  }

  confirmQueryFromIndividualClient = () => {
    const object = {
      clientType: this.state.query.clientType,
      paymentMethod: this.state.query.paymentMethod,
      orderId: this.state.query._id,
      decision: 'confirm'
    };
    this.props.accountantConfirmQuery(object, this.props.history);
  };

  reject = () => {
    const object = {
      decision: 'reject',
      clientType: this.state.query.clientType,
      paymentMethod: this.state.query.paymentMethod,
      orderId: this.state.query._id,
      disinfectors: this.state.query.disinfectors
    };
    this.props.accountantConfirmQuery(object, this.props.history);
  }

  returnBack = () => {
    const object = {
      decision: 'back',
      clientType: this.state.query.clientType,
      paymentMethod: this.state.query.paymentMethod,
      orderId: this.state.query._id,
      disinfectors: this.state.query.disinfectors
    };
    this.props.accountantConfirmQuery(object, this.props.history);
  }

  goToAddNewForm = (order) => {
    this.props.history.push(`/fail/add-new/${order._id}`, {
      pathname: `/fail/add-new/${order._id}`,
      state: { order }
    });
  };

  render() {
    const { query } = this.state;

    let consumptionArray = [];
    if (query.disinfectors) {
      query.disinfectors.forEach(item => {
        consumptionArray.push({
          user: item.user,
          consumption: item.consumption
        });
      });
    }

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
        <div className="row m-0">
          <div className="col-12 p-0">
            <div className="row">
              <div className="col-lg-6 col-md-7">
                {this.props.accountant.loadingQueries ? <Spinner /> : (
                  <div className="card order mt-2">
                    <div className="card-body p-0">
                      <ul className="font-bold mb-0 list-unstyled">
                        {query.disinfectorId && (
                          <li>Ответственный: {query.disinfectorId.occupation} {query.disinfectorId.name}</li>
                        )}

                        {query.failed && <li className="text-danger">Это некачественный заказ</li>}

                        {query.operatorDecided ? (
                          <React.Fragment>
                            <li>Оператор рассмотрел заявку</li>
                            {query.operatorConfirmed ? (
                              <React.Fragment>
                                <li className="text-success">Оператор Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{query.operatorCheckedAt}</Moment>)</li>
                                <li>Балл (0-5): {query.score}</li>
                                <li>Отзыв Клиента: {query.clientReview ? query.clientReview : 'Нет Отзыва'}</li>
                              </React.Fragment>
                            ) : <li className="text-danger">Оператор Отклонил (<Moment format="DD/MM/YYYY HH:mm">{query.operatorCheckedAt}</Moment>)</li>}
                          </React.Fragment>
                        ) : <li>Оператор еще не рассмотрел заявку</li>}

                        {query.clientType === 'corporate' ?
                          <React.Fragment>
                            {query.clientId ? (
                              <li className="text-danger">Корпоративный Клиент: {query.clientId.name}</li>
                            ) : <li className="text-danger">Корпоративный Клиент</li>}
                            <li className="text-danger">Имя клиента: {query.client}</li>
                          </React.Fragment>
                          : ''}

                        {query.clientType === 'individual' ?
                          <li className="text-danger">Физический Клиент: {query.client}</li>
                          : ''}

                        <li className="text-danger">Дата: <Moment format="DD/MM/YYYY">{query.dateFrom}</Moment></li>
                        <li className="text-danger">Время выполнения: С <Moment format="HH:mm">{query.dateFrom}</Moment> ПО <Moment format="HH:mm">{query.completedAt}</Moment></li>
                        <li className="text-danger">Адрес: {query.address}</li>

                        <li>Телефон клиента: {query.phone}</li>
                        {query.phone2 !== '' ? <li>Запасной номер: {query.phone2}</li> : ''}
                        <li>Тип услуги: {query.typeOfService}</li>
                        <li>Комментарии Оператора: {query.comment ? query.comment : '--'}</li>
                        <li>Комментарии Дезинфектора: {query.disinfectorComment ? query.disinfectorComment : '--'}</li>
                        <li>Срок гарантии (в месяцах): {query.guarantee}</li>

                        <li>Расход Материалов (заказ выполнили {query.disinfectors.length} чел):</li>
                        <ul className="font-bold mb-0">
                          {consumptionRender}
                        </ul>

                        {query.clientType === 'corporate' ? (
                          <React.Fragment>
                            {query.paymentMethod === 'cash' ? (
                              <React.Fragment>
                                <li>Тип Платежа: Наличный</li>
                                {query.cost && <li>Общая Сумма: {query.cost.toLocaleString()} UZS (каждому по {(query.cost / query.disinfectors.length).toLocaleString()} UZS)</li>}
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                <li>Тип Платежа: Безналичный</li>
                                <li>Номер Договора: {query.contractNumber}</li>
                              </React.Fragment>
                            )}
                          </React.Fragment>
                        ) : ''}

                        {query.clientType === 'individual' ? (
                          <li>Общая Сумма: {query.cost.toLocaleString()} Сум (каждому по {(query.cost / query.disinfectors.length).toFixed(2).toLocaleString()} Сум)</li>
                        ) : ''}

                        {query.userAcceptedOrder ? (
                          <li>Заказ принял: {query.userAcceptedOrder.occupation} {query.userAcceptedOrder.name}</li>
                        ) : ''}

                        {query.userCreated ? (
                          <li>Заказ добавил: {query.userCreated.occupation} {query.userCreated.name}</li>
                        ) : ''}

                        <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{query.completedAt}</Moment></li>
                      </ul>

                      {query.clientType === 'individual' || query.paymentMethod === 'cash' ? (
                        <div className="btn-group mt-3">
                          <button className="btn btn-success mr-2" onClick={() => { if (window.confirm('Вы уверены подтвердить заказ?')) { this.confirmQueryFromIndividualClient() } }}>Подтвердить</button>
                        </div>
                      ) : ''}

                      <div className="btn-group mt-3">
                        <button className="btn btn-danger mr-2" onClick={() => { if (window.confirm('Вы уверены отменить заказ?')) { this.reject() } }}>Отменить Выполнение Заказа</button>
                      </div>

                      <div className="btn-group mt-3">
                        <button className="btn btn-dark mr-2" onClick={() => { if (window.confirm('Вы уверены отправить заказ обратно дезинфектору?')) { this.returnBack() } }}>Отправить Обратно</button>
                      </div>

                      <div className="btn-group mt-3">
                        <button
                          className="btn btn-secondary mr-2"
                          onClick={() => this.goToAddNewForm(query)}
                        >Клиент Недоволен</button>
                      </div>

                    </div>
                  </div>
                )}
              </div>


              {query.clientType === 'corporate' && query.paymentMethod !== 'cash' && (
                <div className="col-lg-6 col-md-5 mx-auto">
                  <div className="card mt-3 mb-3">
                    <div className="card-body p-2">
                      <h3 className="text-center">Форма Подтверждения Заказа</h3>
                      <form onSubmit={this.confirmQueryFromCorporateClient}>
                        <TextFieldGroup
                          label="Введите Счет-Фактуру:"
                          type="text"
                          name="invoice"
                          value={this.state.invoice}
                          onChange={this.onChange}
                          required
                        />
                        <TextFieldGroup
                          label="Введите сумму заказа (в сумах):"
                          type="number"
                          step="1"
                          name="cost"
                          value={this.state.cost}
                          onChange={this.onChange}
                          required
                        />
                        <button className="btn btn-success btn-block">Подтвердить Выполнение Заказа</button>
                      </form>
                    </div>
                  </div>
                </div>
              )}


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

export default connect(mapStateToProps, { getCompleteOrderById, accountantConfirmQuery })(withRouter(ConfirmQueryForm));