import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import { getAccountantQueries } from '../../actions/accountantActions';
import monthsNames from '../common/monthNames';
import getMonthAndYearLabels from '../../utils/monthAndYearLabels';
import returnMonthAndYear from '../../utils/returnMonthAndYear';

import { getWeekDays, getWeekRange } from '../common/weekFunc';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';


class Queries extends Component {
  state = {
    queries: [],

    month: '',
    year: '',
    day: '',

    // to display month and year in heading h2
    headingMonth: '',
    headingYear: '',
    headingDay: '',
    type: '',

    hoverRange: undefined,
    selectedDays: []
  };

  componentDidMount() {
    if (this.props.accountant.queries && this.props.accountant.queries.length > 0) {
      this.setState({
        queries: this.props.accountant.queries
      });
    }

    // previous method in global state
    let method = this.props.accountant.queryVars.method;

    if (method) {
      this.setState({
        type: method
      });
    }

    if (method === 'day') {
      const dayString = this.props.accountant.queryVars.day.split('-').reverse().join('-')
      this.setState({
        headingDay: dayString
      });
    }

    if (method === 'week') {
      this.setState({
        selectedDays: this.props.accountant.queryVars.days
      });
    }

    if (method === 'month') {
      this.setState({
        headingMonth: this.props.accountant.queryVars.month,
        headingYear: this.props.accountant.queryVars.year
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountant.queries) {
      this.setState({
        queries: nextProps.accountant.queries
      });
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  getMonthStats = (e) => {
    e.preventDefault();
    const object = {
      type: 'month',
      month: Number(this.state.month),
      year: Number(this.state.year)
    };
    this.props.getAccountantQueries(object);
    this.setState({
      type: 'month',
      headingMonth: this.state.month,
      headingYear: this.state.year
    });
  }

  getSpecificMonthStats = (param) => {
    const { month, year } = returnMonthAndYear(param);

    const object = { type: 'month', month, year };

    this.props.getAccountantQueries(object);

    this.setState({
      type: 'month',
      headingMonth: month,
      headingYear: year
    });
  };


  getWeekStats = (days) => {
    const object = {
      type: 'week',
      days: days
    };
    this.props.getAccountantQueries(object);
    this.setState({
      type: 'week'
    });
  }

  getDayStats = (e) => {
    e.preventDefault();
    const object = {
      type: 'day',
      day: this.state.day
    };
    this.props.getAccountantQueries(object);
    this.setState({
      type: object.type,
      headingDay: this.state.day.split('-').reverse().join('-')
    });
  }


  // weekly calendar
  handleDayChange = date => {
    this.getWeekStats(getWeekDays(getWeekRange(date).from));
    this.setState({
      selectedDays: getWeekDays(getWeekRange(date).from),
      type: 'week'
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
    this.getWeekStats(getWeekDays(getWeekRange(days[0]).from));
    this.setState({
      selectedDays: getWeekDays(getWeekRange(days[0]).from),
      type: 'week'
    });
  };
  // end of weekly calendar


  render() {
    const { monthLabels, yearLabels } = getMonthAndYearLabels();

    const yearsOptions = yearLabels.map((year, index) =>
      <option value={year.value} key={index}>{year.label}</option>
    );
    const monthOptions = monthLabels.map((month, index) =>
      <option value={month.value} key={index}>{month.label}</option>
    );


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


    const { queries } = this.state;

    let renderQueries = queries.map((item, key) => {
      return (
        <div className="col-lg-4 col-md-6 mt-2" key={key}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 list-unstyled">
                {item.prevFailedOrder && (
                  <li><h4><i className="fas fas fa-exclamation"></i> Повторный заказ <i className="fas fas fa-exclamation"></i></h4></li>
                )}

                {item.failed && (
                  <li><h4><i className="fas fas fa-exclamation"></i> Некачественный заказ <i className="fas fas fa-exclamation"></i></h4></li>
                )}


                {item.returnedBack && (
                  <li className="text-danger">Это возвращенный заказ</li>
                )}

                {item.disinfectorId && (
                  <li>Ответственный: {item.disinfectorId.occupation} {item.disinfectorId.name}</li>
                )}

                {item.operatorDecided ? (
                  <React.Fragment>
                    <li>Оператор рассмотрел заявку</li>
                    {item.operatorConfirmed ? (
                      <React.Fragment>
                        <li className="text-success">Оператор Подтвердил (<Moment format="DD/MM/YYYY HH:mm">{item.operatorCheckedAt}</Moment>)</li>
                        <li>Балл (0-5): {item.score}</li>
                        <li>Отзыв Клиента: {item.clientReview ? item.clientReview : 'Нет Отзыва'}</li>
                      </React.Fragment>
                    ) : <li className="text-danger">Оператор Отклонил (<Moment format="DD/MM/YYYY HH:mm">{item.operatorCheckedAt}</Moment>)</li>}
                  </React.Fragment>
                ) : <li>Оператор еще не рассмотрел заявку</li>}


                {/* {item.clientType === 'corporate' && <li>Номер Договора: {item.contractNumber}</li>} */}


                {/* {item.clientId ? (
                  <li className="text-danger">Корпоративный Клиент: {item.clientId.name}</li>
                ) : <li className="text-danger">Корпоративный Клиент</li>} */}

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

                {/* <li className="text-danger">Имя клиента: {item.client}</li> */}
                <li className="text-danger">Телефон Клиента: {item.phone}</li>
                <li className="text-danger">Дата выполнения: <Moment format="DD/MM/YYYY">{item.dateFrom}</Moment></li>
                <li className="text-danger">Время выполнения: С <Moment format="HH:mm">{item.dateFrom}</Moment> ПО <Moment format="HH:mm">{item.completedAt}</Moment></li>
                {item.phone2 ? <li className="text-danger">Другой номер: {item.phone2}</li> : ''}
                <li className="text-danger">Адрес: {item.address}</li>

                <li>Комментарии Оператора: {item.comment ? item.comment : '--'}</li>
                <li>Комментарии Дезинфектора: {item.disinfectorComment ? item.disinfectorComment : '--'}</li>

                <li>Форма Выполнения Заказа заполнена: <Moment format="DD/MM/YYYY HH:mm">{item.completedAt}</Moment></li>
              </ul>

              <Link to={`/accountant/order-confirm/${item._id}`} className="btn btn-dark"><i className="fab fa-wpforms"></i> Форма Подтверждения</Link>
            </div>
          </div>
        </div>
      );
    });


    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 col-md-6 mt-3">
            <form onSubmit={this.getMonthStats} className="form-bg p-2">
              <h4 className="text-center">Запросы по месяцам</h4>
              <div className="form-group">
                <label htmlFor="year"><strong>Выберите Год:</strong></label>
                <select name="year" className="form-control" onChange={this.onChange} required>
                  {yearsOptions}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="month"><strong>Выберите Месяц:</strong></label>
                <select name="month" className="form-control" onChange={this.onChange} required>
                  {monthOptions}
                </select>
              </div>
              <button type="submit" className="btn btn-success mr-1 mt-1"><i className="fas fa-search"></i> Искать</button>

              <button type="button" className="btn btn-danger mr-1 mt-1" onClick={() => this.getSpecificMonthStats('current')}>Этот месяц</button>

              <button type="button" className="btn btn-primary mr-1 mt-1" onClick={() => this.getSpecificMonthStats('previous')}>Прошлый месяц</button>
            </form>
          </div>


          <div className="col-lg-4 col-md-6 mt-3">
            <form onSubmit={this.getDayStats} className="form-bg p-2">
              <h4 className="text-center">Запросы по дням</h4>
              <div className="form-group">
                <label htmlFor="day"><strong>Выберите День:</strong></label>
                <input type="date" name="day" className="form-control" onChange={this.onChange} required />
              </div>
              <button type="submit" className="btn btn-primary"><i className="fas fa-search"></i> Искать</button>
            </form>
          </div>


          <div className="col-lg-4 col-md-6 weekly-stats mt-3">
            <div className="SelectedWeekExample form-bg font-weight-bold">
              <h4 className="text-center">Запросы по неделям</h4>
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
        </div>

        <div className="row mt-3">
          <div className="col-12">
            {this.state.type === 'week' ?
              <h2 className="text-center pl-3 pr-3">Запросы за неделю <Moment format="DD/MM/YYYY">{this.state.selectedDays[0]}</Moment> - <Moment format="DD/MM/YYYY">{this.state.selectedDays[6]}</Moment></h2> : ''}

            {this.state.type === 'month' ?
              <h2 className="text-center pl-3 pr-3">Запросы за месяц {monthsNames[this.state.headingMonth]}, {this.state.headingYear}</h2> : ''}

            {this.state.type === 'day' ?
              <h2 className="text-center pl-3 pr-3">Запросы за день {this.state.headingDay}</h2> : ''}
          </div>
        </div>

        <div className="row m-0">
          <div className="col-12 p-0">
            {this.props.accountant.loadingQueries ?
              <Spinner />
              :
              (
                <div className="row mt-3">
                  {this.state.type ? (
                    <React.Fragment>
                      {queries.length === 0 ? (
                        <h2 className="m-auto">Запросы не найдены</h2>
                      ) : (
                        renderQueries
                      )}
                    </React.Fragment>
                  ) : ''}
                </div>
              )
            }
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

export default connect(mapStateToProps, { getAccountantQueries })(withRouter(Queries));