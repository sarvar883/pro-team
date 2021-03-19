import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import { getGenStatsForAdmin, clearStatsData } from '../../actions/adminActions';
import monthsNames from '../common/monthNames';
import getMonthAndYearLabels from '../../utils/monthAndYearLabels';
import returnMonthAndYear from '../../utils/returnMonthAndYear';

import ShowAdminStats from './ShowAdminStats';


import { getWeekDays, getWeekRange } from '../common/weekFunc';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';


class AdminStats extends Component {
  state = {
    month: '',
    year: '',
    day: '',

    // to display month and year in heading h2
    headingMonth: '',
    headingYear: '',
    headingDay: '',

    hoverRange: undefined,
    selectedDays: []
  };

  componentWillMount() {
    this.props.clearStatsData();
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  getMonthStats = (e) => {
    e.preventDefault();
    let object = {
      type: 'month',
      month: Number(this.state.month),
      year: Number(this.state.year)
    };

    this.props.getGenStatsForAdmin(object);

    // this.props.getMonthStatsForAdmin(this.state.month, this.state.year);
    this.setState({
      headingMonth: this.state.month,
      headingYear: this.state.year
    });
  }

  getSpecificMonthStats = (param) => {
    const { month, year } = returnMonthAndYear(param);

    const object = { type: 'month', month, year };

    this.props.getGenStatsForAdmin(object);

    this.setState({
      headingMonth: month,
      headingYear: year
    });
  };

  getDayStats = (e) => {
    e.preventDefault();
    let object = {
      type: 'day',
      day: this.state.day
    };

    this.props.getGenStatsForAdmin(object);

    // this.props.getDayStatsForAdmin(this.state.day);
    this.setState({
      headingDay: this.state.day.split('-').reverse().join('-')
    });
  }


  // weekly calendar
  handleDayChange = date => {
    let object = {
      type: 'week',
      days: getWeekDays(getWeekRange(date).from)
    };
    this.props.getGenStatsForAdmin(object);
    // this.props.getWeekStatsForAdmin(getWeekDays(getWeekRange(date).from));
    this.setState({
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
    let object = {
      type: 'week',
      days: getWeekDays(getWeekRange(days[0]).from)
    };
    this.props.getGenStatsForAdmin(object);
    // this.props.getWeekStatsForAdmin(getWeekDays(getWeekRange(days[0]).from));
    this.setState({
      selectedDays: getWeekDays(getWeekRange(days[0]).from)
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
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 col-md-6 mt-3">
            <form onSubmit={this.getMonthStats} className="form-bg p-2">
              <h4 className="text-center">Статистика по месяцам</h4>
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
              <button type="submit" className="btn btn-success mr-1 mt-1">Искать</button>

              <button type="button" className="btn btn-danger mr-1 mt-1" onClick={() => this.getSpecificMonthStats('current')}>Этот месяц</button>

              <button type="button" className="btn btn-primary mr-1 mt-1" onClick={() => this.getSpecificMonthStats('previous')}>Прошлый месяц</button>
            </form>
          </div>


          <div className="col-lg-4 col-md-6 mt-3">
            <form onSubmit={this.getDayStats} className="form-bg p-2">
              <h4 className="text-center">Статистика по дням</h4>
              <div className="form-group">
                <label htmlFor="day"><strong>Выберите День:</strong></label>
                <input type="date" name="day" className="form-control" onChange={this.onChange} required />
              </div>
              <button type="submit" className="btn btn-primary">Искать</button>
            </form>
          </div>


          <div className="col-lg-4 col-md-6 weekly-stats mt-3">
            <div className="SelectedWeekExample form-bg font-weight-bold">
              <h4 className="text-center">Статистика по неделям</h4>
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
            {this.props.admin.method === 'week' ?
              <h2 className="text-center pl-3 pr-3">Недельная статистика за <Moment format="DD/MM/YYYY">{this.state.selectedDays[0]}</Moment> - <Moment format="DD/MM/YYYY">{this.state.selectedDays[6]}</Moment></h2> : ''}

            {this.props.admin.method === 'month' ?
              <h2 className="text-center pl-3 pr-3">Месячная Статистика за {monthsNames[this.state.headingMonth]}, {this.state.headingYear}</h2> : ''}

            {this.props.admin.method === 'day' ?
              <h2 className="text-center pl-3 pr-3">Дневная Статистика за {this.state.headingDay}</h2> : ''}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {this.props.admin.loadingStats ? <Spinner /> : <ShowAdminStats />}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  admin: state.admin,
  errors: state.errors
});

export default connect(mapStateToProps, { getGenStatsForAdmin, clearStatsData })(withRouter(AdminStats));