import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import { getUserMatComing } from '../../actions/disinfectorActions';
import monthsNames from '../common/monthNames';
import getMonthAndYearLabels from '../../utils/monthAndYearLabels';
import returnMonthAndYear from '../../utils/returnMonthAndYear';

import ShowDisMatComings from './ShowDisMatComings';


import { getWeekDays, getWeekRange } from '../common/weekFunc';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';


class DisMatCom extends Component {
  state = {
    month: '',
    year: '',

    method: '',

    // // to display month and year in heading h2
    headingMonth: '',
    headingYear: '',

    hoverRange: undefined,
    selectedDays: []
  };

  componentDidMount() {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const object = {
      userId: this.props.auth.user.id,
      type: 'month',
      month: thisMonth,
      year: thisYear
    };
    this.props.getUserMatComing(object);
    this.setState({
      headingMonth: thisMonth,
      headingYear: thisYear,
      method: 'month'
    });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  getMonthStats = (e) => {
    e.preventDefault();

    const object = {
      userId: this.props.auth.user.id,
      type: 'month',
      month: this.state.month,
      year: this.state.year
    };
    this.props.getUserMatComing(object);

    this.setState({
      headingMonth: this.state.month,
      headingYear: this.state.year,
      method: 'month'
    });
  }

  getSpecificMonthStats = (param) => {
    const { month, year } = returnMonthAndYear(param);

    const object = {
      userId: this.props.auth.user.id,
      type: 'month', month, year
    };

    this.props.getUserMatComing(object);

    this.setState({
      headingMonth: month,
      headingYear: year,
      method: 'month'
    });
  };



  // weekly calendar
  handleDayChange = date => {
    const object = {
      userId: this.props.auth.user.id,
      type: 'week',
      days: getWeekDays(getWeekRange(date).from)
    };
    this.props.getUserMatComing(object);

    this.setState({
      selectedDays: getWeekDays(getWeekRange(date).from),
      method: 'week'
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
    const object = {
      userId: this.props.auth.user.id,
      type: 'week',
      days: getWeekDays(getWeekRange(days[0]).from)
    };
    this.props.getUserMatComing(object);

    this.setState({
      selectedDays: getWeekDays(getWeekRange(days[0]).from),
      method: 'week'
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



    return (
      <div className="container-fluid" >
        <div className="row">
          <div className="col-lg-4 col-md-6 mt-3">
            <form onSubmit={this.getMonthStats} className="form-bg p-2">
              <h4 className="text-center">Приход Материалов по месяцам</h4>
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
              <button type="submit" className="btn btn-success">Искать</button>

              <button type="button" className="btn btn-danger ml-2" onClick={() => this.getSpecificMonthStats('current')}>Этот месяц</button>

              <button type="button" className="btn btn-primary ml-2" onClick={() => this.getSpecificMonthStats('previous')}>Прошлый месяц</button>
            </form>
          </div>

          <div className="col-lg-4 col-md-6 mt-3 ml-auto weekly-stats">
            <div className="SelectedWeekExample form-bg font-weight-bold">
              <h4 className="text-center">Приход Материалов по неделям</h4>
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

        <div className="row mt-2">
          <div className="col-12">
            {this.state.method === 'week' ?
              <h2 className="text-center pl-3 pr-3">Ваш Недельный Приход Материалов за <Moment format="DD/MM/YYYY">{this.state.selectedDays[0]}</Moment> - <Moment format="DD/MM/YYYY">{this.state.selectedDays[6]}</Moment></h2> :
              <h2 className="text-center pl-3 pr-3">Ваш Месячный Приход Материалов за {monthsNames[this.state.headingMonth]}, {this.state.headingYear}</h2>
            }
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {this.props.disinfector.loadingDisinfStats ? <Spinner /> : <ShowDisMatComings />}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
  disinfector: state.disinfector,
  subadmin: state.subadmin,
  errors: state.errors
});

export default connect(mapStateToProps, { getUserMatComing })(withRouter(DisMatCom));