import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import { getAllDisinfectors, getSubMatDistrib } from '../../actions/subadminActions';
import monthsNames from '../common/monthNames';
import getMonthAndYearLabels from '../../utils/monthAndYearLabels';
import returnMonthAndYear from '../../utils/returnMonthAndYear';

import ShowMatDistrib from './ShowMatDistrib';

import { getWeekDays, getWeekRange } from '../common/weekFunc';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';


class MatDistribHistory extends Component {
  state = {
    month: '',
    year: '',

    // // to display month and year in heading h2
    headingMonth: '',
    headingYear: '',

    hoverRange: undefined,
    selectedDays: []
  };

  componentDidMount() {
    const object = {
      subadmin: this.props.auth.user.id,
      type: 'month',
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    };
    this.props.getSubMatDistrib(object);
    this.props.getAllDisinfectors();
    this.setState({
      headingMonth: object.month,
      headingYear: object.year
    });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  getMonthStats = (e) => {
    e.preventDefault();
    const object = {
      subadmin: this.props.auth.user.id,
      type: 'month',
      month: Number(this.state.month),
      year: Number(this.state.year),
    };
    this.props.getSubMatDistrib(object);
    this.setState({
      headingMonth: this.state.month,
      headingYear: this.state.year
    });
  }

  getSpecificMonthStats = (param) => {
    const { month, year } = returnMonthAndYear(param);

    const object = {
      subadmin: this.props.auth.user.id,
      type: 'month', month, year
    };

    this.props.getSubMatDistrib(object);

    this.setState({
      headingMonth: month,
      headingYear: year
    });
  };



  // weekly calendar
  handleDayChange = date => {
    const object = {
      type: 'week',
      subadmin: this.props.auth.user.id,
      days: getWeekDays(getWeekRange(date).from)
    }
    this.props.getSubMatDistrib(object);
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
    const object = {
      type: 'week',
      subadmin: this.props.auth.user.id,
      days: getWeekDays(getWeekRange(days[0]).from)
    }
    this.props.getSubMatDistrib(object);

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
      <div className="container-fluid" >
        <div className="row">
          <div className="col-lg-4 col-md-6 mt-3">
            <form onSubmit={this.getMonthStats} className="form-bg p-2">
              <h4 className="text-center">Раздача Материалов по месяцам</h4>
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

          <div className="col-lg-4 col-md-6 mt-3 ml-auto weekly-stats">
            <div className="SelectedWeekExample form-bg font-weight-bold">
              <h4 className="text-center">Раздача Материалов по неделям</h4>
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
            {this.props.subadmin.method === 'week' ?
              <h2 className="text-center pl-3 pr-3">Недельная Раздача Материалов за <Moment format="DD/MM/YYYY">{this.state.selectedDays[0]}</Moment> - <Moment format="DD/MM/YYYY">{this.state.selectedDays[6]}</Moment></h2> :
              <h2 className="text-center pl-3 pr-3">Месячная Раздача Материалов за {monthsNames[this.state.headingMonth]}, {this.state.headingYear}</h2>
            }
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {this.props.subadmin.loadingStats ? <Spinner /> : <ShowMatDistrib />}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  subadmin: state.subadmin,
  errors: state.errors
});

export default connect(mapStateToProps, { getAllDisinfectors, getSubMatDistrib })(withRouter(MatDistribHistory));