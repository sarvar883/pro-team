import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import { getFailedOrders } from '../../actions/failActions';
import monthsNames from '../common/monthNames';
import getMonthAndYearLabels from '../../utils/monthAndYearLabels';
import ShowFails from './ShowFails';

import { getWeekDays, getWeekRange } from '../common/weekFunc';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';


class SeeFails extends Component {
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

  componentDidMount() {
    // previous method in global state
    let method = this.props.fail.searchVars.method;

    if (method) {
      this.setState({
        type: method
      });
    }

    if (method === 'day') {
      const dayString = this.props.fail.searchVars.day.split('-').reverse().join('-')
      this.setState({
        headingDay: dayString
      });
    }

    if (method === 'week') {
      this.setState({
        selectedDays: this.props.fail.searchVars.days
      });
    }

    if (method === 'month') {
      this.setState({
        headingMonth: this.props.fail.searchVars.month,
        headingYear: this.props.fail.searchVars.year
      });
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  failedOrdersDay = (e) => {
    e.preventDefault();

    const object = {
      userOccupation: this.props.auth.user.occupation,
      userId: this.props.auth.user.id,
      type: 'day',
      day: this.state.day
    };
    console.log('day', object);
    this.props.getFailedOrders(object);

    this.setState({
      headingDay: this.state.day.split('-').reverse().join('-')
    });
  };


  // weekly calendar
  handleDayChange = date => {
    const object = {
      userOccupation: this.props.auth.user.occupation,
      userId: this.props.auth.user.id,
      type: 'week',
      days: getWeekDays(getWeekRange(date).from)
    };
    this.props.getFailedOrders(object);

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
      userOccupation: this.props.auth.user.occupation,
      userId: this.props.auth.user.id,
      type: 'week',
      days: getWeekDays(getWeekRange(days[0]).from)
    };
    this.props.getFailedOrders(object);

    this.setState({
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



    return (
      <div className="container-fluid">
        <div className="row">

          <div className="col-lg-4 col-md-6 mt-3">
            <form onSubmit={this.failedOrdersDay} className="form-bg p-2">
              <h4 className="text-center">Некачественные заказы по дням</h4>
              <div className="form-group">
                <label htmlFor="day"><strong>Выберите День:</strong></label>
                <input type="date" name="day" className="form-control" onChange={this.onChange} required />
              </div>
              <button type="submit" className="btn btn-primary">Искать</button>
            </form>
          </div>


          <div className="col-lg-4 col-md-6 weekly-stats mt-3">
            <div className="SelectedWeekExample form-bg font-weight-bold">
              <h4 className="text-center">Некачественные заказы по неделям</h4>
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
            {this.props.fail.searchVars.method === 'week' ?
              <h2 className="text-center pl-3 pr-3">Некачественные заказы за <Moment format="DD/MM/YYYY">{this.state.selectedDays[0]}</Moment> - <Moment format="DD/MM/YYYY">{this.state.selectedDays[6]}</Moment></h2> : ''}

            {this.props.fail.searchVars.method === 'month' ?
              <h2 className="text-center pl-3 pr-3">Некачественные заказы за {monthsNames[this.state.headingMonth]}, {this.state.headingYear}</h2> : ''}

            {this.props.fail.searchVars.method === 'day' ?
              <h2 className="text-center pl-3 pr-3">Некачественные заказы за {this.state.headingDay}</h2> : ''}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {this.props.fail.loading ? <Spinner /> : <ShowFails />}
          </div>
        </div>
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

export default connect(mapStateToProps, { getFailedOrders })(withRouter(SeeFails));