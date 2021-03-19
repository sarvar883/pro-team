import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import {
  getAllOperatorsAndAmins,
  getOperatorStats,
  clearStatsData
} from '../../actions/adminActions';
import monthsNames from '../common/monthNames';
import getMonthAndYearLabels from '../../utils/monthAndYearLabels';
import ShowOperStats from './ShowOperStats';


import { getWeekDays, getWeekRange } from '../common/weekFunc';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';


class OperStats extends Component {
  state = {
    month: '',
    year: '',
    day: '',

    // // to display month and year in heading h2
    headingMonth: '',
    headingYear: '',
    headingDay: '',

    hoverRange: undefined,
    selectedDays: [],
    selectedDaysAfterSubmit: [],

    operatorId: '',
    operatorName: '',
    occupation: ''
  };

  componentWillMount() {
    this.props.clearStatsData();
  }

  componentDidMount() {
    this.props.getAllOperatorsAndAmins();
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  getMonthStats = (e) => {
    e.preventDefault();
    this.props.admin.operators.forEach(person => {
      if (person._id.toString() === this.state.operatorId.toString()) {
        this.setState({
          headingMonth: this.state.month,
          headingYear: this.state.year,
          operatorName: person.name,
          occupation: person.occupation
        });
      }
    });
    const object = {
      type: 'month',
      operatorId: this.state.operatorId,
      month: Number(this.state.month),
      year: Number(this.state.year)
    };
    this.props.getOperatorStats(object);
  }

  getWeekStats = (e) => {
    e.preventDefault();
    if (this.state.selectedDays.length === 0) {
      alert('Вы не выбрали неделю');
    } else {
      this.props.admin.operators.forEach(person => {
        if (person._id.toString() === this.state.operatorId.toString()) {
          this.setState({
            selectedDaysAfterSubmit: this.state.selectedDays,
            operatorName: person.name,
            occupation: person.occupation
          });
        }
      });
      const object = {
        type: 'week',
        operatorId: this.state.operatorId,
        days: this.state.selectedDays
      };
      this.props.getOperatorStats(object);
    }
  }

  getDayStats = (e) => {
    e.preventDefault();
    this.props.admin.operators.forEach(person => {
      if (person._id.toString() === this.state.operatorId.toString()) {
        this.setState({
          headingDay: this.state.day.split('-').reverse().join('-'),
          operatorName: person.name,
          occupation: person.occupation
        });
      }
    });
    const object = {
      type: 'day',
      operatorId: this.state.operatorId,
      day: this.state.day
    };
    this.props.getOperatorStats(object);
  }


  // weekly calendar
  handleDayChange = date => {
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

    let operatorOptions = [{
      label: "-- Выберите Оператора/Админа -- ", value: ""
    }];

    this.props.admin.operators.forEach(person => {
      operatorOptions.push({
        label: `${person.occupation} ${person.name}`, value: person._id
      });
    });

    let renderOperatorOptions = operatorOptions.map((item, index) =>
      <option value={item.value} key={index}>{item.label}</option>
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
              <h4 className="text-center">Статистика по месяцам</h4>
              <div className="form-group">
                <label htmlFor="operatorId"><strong>Выберите Оператора/Админа:</strong></label>
                <select name="operatorId" className="form-control" onChange={this.onChange} required>
                  {renderOperatorOptions}
                </select>
              </div>
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
            </form>
          </div>

          <div className="col-lg-4 col-md-6 mt-3">
            <form onSubmit={this.getDayStats} className="form-bg p-2">
              <h4 className="text-center">Статистика по дням</h4>
              <div className="form-group">
                <label htmlFor="operatorId"><strong>Выберите Оператора/Админа:</strong></label>
                <select name="operatorId" className="form-control" onChange={this.onChange} required>
                  {renderOperatorOptions}
                </select>
              </div>
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
            <form onSubmit={this.getWeekStats} className="form-bg p-2">
              <div className="form-group">
                <label htmlFor="operatorId"><strong>Выберите Оператора/Админа:</strong></label>
                <select name="operatorId" className="form-control" onChange={this.onChange} required>
                  {renderOperatorOptions}
                </select>
              </div>
              <button type="submit" className="btn btn-success">Искать</button>
            </form>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-12">
            {this.props.admin.method === 'week' && this.state.operatorName && this.state.selectedDays ?
              <h2 className="text-center pl-3 pr-3">Недельная статистика {this.state.occupation} {this.state.operatorName} за <Moment format="DD/MM/YYYY">{this.state.selectedDaysAfterSubmit[0]}</Moment> - <Moment format="DD/MM/YYYY">{this.state.selectedDaysAfterSubmit[6]}</Moment></h2> : ''
            }

            {this.props.admin.method === 'month' && this.state.operatorName && this.state.headingMonth && this.state.headingYear ?
              <h2 className="text-center pl-3 pr-3">Месячная Статистика {this.state.occupation} {this.state.operatorName} за {monthsNames[this.state.headingMonth]}, {this.state.headingYear}</h2> : ''}

            {this.props.admin.method === 'day' && this.state.operatorName && this.state.headingDay ?
              <h2 className="text-center pl-3 pr-3">Дневная Статистика {this.state.occupation} {this.state.operatorName} за {this.state.headingDay}</h2> : ''}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {this.props.admin.loadingStats ? <Spinner /> : <ShowOperStats />}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
  errors: state.errors
});

export default connect(mapStateToProps, { getAllOperatorsAndAmins, getOperatorStats, clearStatsData })(withRouter(OperStats));