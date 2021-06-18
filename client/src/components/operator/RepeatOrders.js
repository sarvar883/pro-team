import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import {
  getRepeatOrders,
  repeatOrderNotNeeded
} from '../../actions/operatorActions';


import { getWeekDays, getWeekRange } from '../common/weekFunc';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';


class RepeatOrders extends Component {
  state = {
    repeatOrders: [],

    day: '',

    // to display month and year in heading h2
    // headingMonth: '',
    // headingYear: '',
    headingDay: '',

    method: '',
    hoverRange: undefined,
    selectedDays: []
  };


  // THIS <CACHING> NOT USED CURRENTLY BECAUSE IF REPEAT ORDER NOT NEEDED, THEN WE NEED TO DELETE THAT ORDER FROM GLOBAL STATE AND FROM DOM WHICH IS NOT YET DONE

  // componentDidMount() {
  // if (
  //   this.props.operator.repeatOrders &&
  //   this.props.operator.repeatOrders.length > 0
  // ) {
  //   this.setState({
  //     repeatOrders: this.props.operator.repeatOrders,
  //     headingDay: this.props.operator.repeatOrderSearchVars.headingDay,
  //     method: this.props.operator.repeatOrderSearchVars.method,
  //     selectedDays: this.props.operator.repeatOrderSearchVars.selectedDays
  //   });
  // }
  // }

  componentWillReceiveProps(nextProps) {
    this.setState({
      repeatOrders: nextProps.operator.repeatOrders
    });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  getDayRepeats = (e) => {
    e.preventDefault();
    let object = {
      operatorId: this.props.auth.user.id,
      type: 'day',
      day: this.state.day
    };

    this.props.getRepeatOrders(object);

    this.setState({
      method: 'day',
      headingDay: this.state.day.split('-').reverse().join('-')
    });
  }

  noNeed = (id) => {
    this.props.repeatOrderNotNeeded(id, this.props.history, this.props.auth.user.occupation);
  }


  // weekly calendar
  handleDayChange = date => {
    // this.props.getWeekStatsForAdmin(getWeekDays(getWeekRange(date).from));
    let object = {
      operatorId: this.props.auth.user.id,
      type: 'week',
      days: getWeekDays(getWeekRange(date).from)
    };

    this.props.getRepeatOrders(object);

    this.setState({
      method: 'week',
      selectedDays: getWeekDays(getWeekRange(date).from)
    });
  };

  handleDayEnter = date => {
    this.setState({
      hoverRange: getWeekRange(date)
    });
  };

  handleDayLeave = () => {
    this.setState({
      hoverRange: undefined
    });
  };

  handleWeekClick = (weekNumber, days, e) => {
    // this.props.getWeekStatsForAdmin(getWeekDays(getWeekRange(days[0]).from));
    let object = {
      operatorId: this.props.auth.user.id,
      type: 'week',
      days: getWeekDays(getWeekRange(days[0]).from)
    };

    this.props.getRepeatOrders(object);

    this.setState({
      method: 'week',
      selectedDays: getWeekDays(getWeekRange(days[0]).from)
    });
  };
  // end of weekly calendar


  render() {
    // weekly calender
    const { hoverRange, selectedDays } = this.state;

    const daysAreSelected = selectedDays.length > 0;

    const modifiers = {
      hoverRange,
      selectedRange: daysAreSelected && {
        from: selectedDays[0],
        to: selectedDays[6],
      },
      hoverRangeStart: hoverRange && hoverRange.from,
      hoverRangeEnd: hoverRange && hoverRange.to,
      selectedRangeStart: daysAreSelected && selectedDays[0],
      selectedRangeEnd: daysAreSelected && selectedDays[6]
    };
    // end of calendar


    let renderOrders = this.state.repeatOrders.map((item, index) => {
      let consumptionArray = [];
      item.previousOrder.disinfectors.forEach(object => {
        consumptionArray.push({
          user: object.user,
          consumption: object.consumption
        });
      });


      let consumptionRender = consumptionArray.map((element, key) =>
        <li key={key}>
          <p className="mb-0">Пользователь: {element.user.occupation} {element.user.name}</p>
          {element.consumption.map((thing, number) =>
            <p key={number} className="mb-0">{thing.material}: {thing.amount.toLocaleString()} {thing.unit}</p>
          )}
        </li>
      );

      return (
        <React.Fragment key={index}>
          <div className="col-lg-4 col-md-6 mt-3">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <ul className="font-bold mb-0 list-unstyled">
                  {item.disinfectorId && (
                    <li>Ответственный: {item.disinfectorId.occupation} {item.disinfectorId.name}</li>
                  )}

                  {item.clientType === 'corporate' ?
                    <React.Fragment>
                      {item.clientId ? (
                        <li>Корпоративный Клиент: {item.clientId.name}</li>
                      ) : <li>Корпоративный Клиент</li>}
                      <li>Имя клиента: {item.client}</li>
                    </React.Fragment>
                    : ''}

                  {item.clientType === 'individual' ?
                    <li>Физический Клиент: {item.client}</li>
                    : ''}

                  <li>Телефон: {item.phone}</li>
                  {item.phone2 && item.phone2 !== '' ? <li>Запасной номер: {item.phone2}</li> : ''}
                  <li>Адрес: {item.address}</li>
                  <li>Тип услуги: {item.typeOfService}</li>
                  <li>Дата предыдущего заказа: <Moment format="DD/MM/YYYY">{item.previousOrder.dateFrom}</Moment></li>
                  <li>Срок гарантии (в месяцах): {item.previousOrder.guarantee}</li>
                  <li>Срок гарантии истекает: <Moment format="DD/MM/YYYY">{item.timeOfRepeat}</Moment></li>
                </ul>

                <button type="button" className="btn btn-primary mt-2" data-toggle="modal" data-target={`#info${index}`}>Полная информация о предыдущем заказе</button>

                <Link to={`/create-repeat-order-form/${item._id}`} className="btn btn-success mt-2">Повторная работа нужна</Link>

                <button className="btn btn-danger mt-2" onClick={() => { if (window.confirm('Вы  уверены?')) return this.noNeed(item._id) }}>Повторная работа не нужна</button>

              </div>
            </div>
          </div>

          <div className="modal fade" id={`info${index}`}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body">
                  <ul className="font-bold mb-0 list-unstyled">
                    {item.disinfectorId && (
                      <li>Ответственный: {item.disinfectorId.occupation} {item.disinfectorId.name}</li>
                    )}

                    {item.clientType === 'corporate' ?
                      <React.Fragment>
                        {item.clientId ? (
                          <li className="text-danger">Корпоративный Клиент: {item.clientId.name}</li>
                        ) : <li className="text-danger">Корпоративный Клиент</li>}
                        <li className="text-danger">Имя клиента: {item.client}</li>
                        <li>Номер договора: {item.previousOrder.contractNumber}</li>
                      </React.Fragment>
                      : ''}

                    {item.clientType === 'individual' ?
                      <li className="text-danger">Физический Клиент: {item.client}</li>
                      : ''}

                    <li className="text-danger">Телефон: {item.phone}</li>
                    {item.phone2 && item.phone2 !== '' ? <li className="text-danger">Запасной номер: {item.phone2}</li> : ''}
                    <li className="text-danger">Адрес: {item.address}</li>
                    <li className="text-danger">Дата: <Moment format="DD/MM/YYYY">{item.previousOrder.dateFrom}</Moment></li>
                    <li className="text-danger">Время выполнения: С <Moment format="HH:mm">{item.previousOrder.dateFrom}</Moment> ПО <Moment format="HH:mm">{item.previousOrder.completedAt}</Moment></li>
                    <li className="text-danger">Тип услуги: {item.typeOfService}</li>

                    <li>Откуда узнали: {item.advertising}</li>
                    <li>Срок гарантии (в месяцах): {item.previousOrder.guarantee}</li>
                    <li>Комментарии Оператора: {item.previousOrder.comment ? item.previousOrder.comment : '--'}</li>
                    <li>Комментарии Дезинфектора: {item.previousOrder.disinfectorComment ? item.previousOrder.disinfectorComment : '--'}</li>

                    {item.userAcceptedOrder ? (
                      <li>Заказ принял: {item.userAcceptedOrder.occupation} {item.userAcceptedOrder.name}</li>
                    ) : ''}

                    {item.userCreated ? (
                      <li>Заказ Добавлен: {item.userCreated.occupation} {item.userCreated.name} (время: <Moment format="DD/MM/YYYY HH:mm">{item.createdAt}</Moment>)</li>
                    ) : ''}

                    <li>Расход Материалов:</li>
                    <ul className="font-bold mb-0">
                      {consumptionRender}
                    </ul>

                    {item.previousOrder.operatorDecided ? (
                      <React.Fragment>
                        <li>Оператор рассмотрел заявку (время: <Moment format="DD/MM/YYYY HH:mm">{item.previousOrder.operatorCheckedAt}</Moment>)</li>
                        {item.previousOrder.operatorConfirmed ? <li className="text-success">Оператор подтвердил заяку</li> : <li className="text-danger">Оператор отверг заяку</li>}
                        <li>Балл: {item.previousOrder.score}</li>
                        <li>Отзыв Клиента: {item.previousOrder.clientReview}</li>
                      </React.Fragment>
                    ) : <li>Оператор еще не рассмотрел заявку</li>}













                    {item.previousOrder.accountantDecided ? (
                      <React.Fragment>
                        <li>Бухгалтер рассмотрел заявку</li>
                        {item.previousOrder.accountantConfirmed ? (
                          <React.Fragment>
                            <li className="text-success">Бухгалтер Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{item.previousOrder.accountantCheckedAt}</Moment>)</li>
                            <li>Счет-Фактура: {item.previousOrder.invoice ? item.previousOrder.invoice : '--'}</li>
                            <li>Общая Сумма: {item.previousOrder.cost.toLocaleString()} UZS (каждому по {(item.previousOrder.cost / item.previousOrder.disinfectors.length).toLocaleString()} UZS)</li>
                          </React.Fragment>
                        ) : <li className="text-danger">Бухгалтер Отклонил (<Moment format="DD/MM/YYYY HH:mm">{item.previousOrder.accountantCheckedAt}</Moment>)</li>}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>

                        {item.previousOrder.adminDecided ? (
                          <React.Fragment>
                            <li>Админ рассмотрел заявку</li>
                            {item.previousOrder.adminConfirmed ? (
                              <li className="text-success">Админ Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{item.previousOrder.adminCheckedAt}</Moment>)</li>
                            ) : <li className="text-danger">Админ Отклонил (<Moment format="DD/MM/YYYY HH:mm">{item.previousOrder.adminCheckedAt}</Moment>)</li>}
                          </React.Fragment>
                        ) : (
                          <li>Бухгалтер еще не рассмотрел заявку</li>
                        )}

                      </React.Fragment>
                    )}




                    {/* {item.clientType === 'corporate' ? (
                      <React.Fragment>
                        {item.previousOrder.accountantDecided ? (
                          <React.Fragment>
                            <li>Бухгалтер рассмотрел заявку (время: <Moment format="DD/MM/YYYY HH:mm">{item.previousOrder.accountantCheckedAt}</Moment>)</li>
                            {item.previousOrder.accountantConfirmed ? (
                              <React.Fragment>
                                <li className="text-success">Бухгалтер подтвердил заяку</li>
                                <li>Общая сумма: {item.previousOrder.cost.toLocaleString()} UZS</li>
                                <li>Счет-Фактура: {item.previousOrder.invoice}</li>
                              </React.Fragment>
                            ) : <li className="text-danger">Бухгалтер отверг заяку</li>}
                          </React.Fragment>
                        ) : <li>Бухгалтер еще не рассмотрел заявку</li>}
                      </React.Fragment>
                    ) : ''}

                    {item.clientType === 'individual' ? (
                      <React.Fragment>
                        {item.previousOrder.adminDecided ? (
                          <React.Fragment>
                            <li>Админ рассмотрел заявку (время: <Moment format="DD/MM/YYYY HH:mm">{item.previousOrder.adminCheckedAt}</Moment>)</li>
                            {item.previousOrder.adminConfirmed ? <li className="text-success">Админ подтвердил заяку</li> : <li className="text-danger">Админ отверг заяку</li>}
                          </React.Fragment>
                        ) : ''}
                      </React.Fragment>
                    ) : ''} */}









                  </ul>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" data-dismiss="modal">Закрыть</button>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )
    });

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center">Повторные продажи</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4 col-md-6 weekly-stats mt-3">
            <div className="SelectedWeekExample form-bg font-weight-bold">
              <h4 className="text-center">Повторные продажи по неделям</h4>
              <DayPicker
                selectedDays={selectedDays}
                showWeekNumbers
                showOutsideDays
                modifiers={modifiers}
                firstDayOfWeek={1}
                onDayClick={this.handleDayChange}
                onDayMouseEnter={this.handleDayEnter}
                onDayMouseLeave={this.handleDayLeave}
                onWeekClick={this.handleWeekClick}
              />
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mt-3">
            <form onSubmit={this.getDayRepeats} className="form-bg p-2">
              <h4 className="text-center">Повторные продажи по дням</h4>
              <div className="form-group">
                <label htmlFor="day"><strong>Выберите День:</strong></label>
                <input type="date" name="day" className="form-control" onChange={this.onChange} required />
              </div>
              <button type="submit" className="btn btn-primary"><i className="fas fa-search"></i> Искать</button>
            </form>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {this.state.method === 'week' ?
              <h2 className="text-center pl-3 pr-3">Недельные повторные продажи за <Moment format="DD/MM/YYYY">{this.state.selectedDays[0]}</Moment> - <Moment format="DD/MM/YYYY">{this.state.selectedDays[6]}</Moment></h2> : ''}

            {this.state.method === 'day' ?
              <h2 className="text-center pl-3 pr-3">Дневные повторные продажи за {this.state.headingDay}</h2> : ''}
          </div>
        </div>

        {this.props.operator.loadingSortedOrders ? <Spinner /> : (
          <div className="row">
            {renderOrders}
          </div>
        )}
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

export default connect(mapStateToProps, { getRepeatOrders, repeatOrderNotNeeded })(withRouter(RepeatOrders));