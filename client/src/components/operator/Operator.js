import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Calendar from 'react-calendar';
import Moment from 'react-moment';
import Spinner from '../common/Spinner';
import { Swipeable } from 'react-swipeable';

import { getSortedOrders } from '../../actions/operatorActions';

import SortedOrders from './SortedOrders';

class Operator extends Component {
  state = {
    date: new Date()
  }

  componentDidMount() {
    // if (
    //   this.props.operator.date &&
    //   this.props.operator.sortedOrders &&
    //   this.props.operator.sortedOrders.length > 0
    // ) {
    //   this.setState({
    //     date: this.props.operator.date
    //   });
    // } else {
    this.props.getSortedOrders(this.state.date);
    // }
  };

  onChange = (date) => {
    // do not send another request if orders are already being loaded
    if (!this.props.operator.loadingSortedOrders) {
      this.setState({
        date: date
      });
      this.props.getSortedOrders(date);
    }
  };

  onSwiped = (direction) => {
    let newDate = new Date(this.state.date);

    if (direction === 'LEFT') {
      // add 1 day to state date
      newDate.setTime(newDate.getTime() + 1000 * 60 * 60 * 24);

      this.setState({
        date: newDate
      });
    } else if (direction === 'RIGHT') {
      // decrement 1 day from state date
      newDate.setTime(newDate.getTime() - 1000 * 60 * 60 * 24);

      this.setState({
        date: newDate
      });
    }

    this.props.getSortedOrders(this.state.date);
  };

  today = () => {
    let newDate = new Date();

    // do not send another request if orders are already being loaded
    if (!this.props.operator.loadingSortedOrders) {
      this.setState({
        date: newDate
      });
      this.props.getSortedOrders(newDate);
    }
  };

  render() {
    const { loadingSortedOrders } = this.props.operator;

    return (
      <div className="container-fluid mt-1">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center">???????????????? ?????????????????? {this.props.auth.user.name}</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-3 mt-4 calendar">
            <div className="sticky-top">
              <Calendar
                onChange={this.onChange}
                value={this.state.date}
              />

              <button
                className="btn btn-dark mt-3"
                onClick={() => this.today()}
              >
                <i className="fas fa-calendar-day"></i> ???????????????? ??????????????
              </button>
            </div>
          </div>
          <div className="col-lg-9">
            <h2 className="text-center">???????????? ???? <Moment format="DD/MM/YYYY">{this.state.date}</Moment></h2>
            {loadingSortedOrders ? <Spinner /> : (
              <Swipeable
                trackMouse
                preventDefaultTouchmoveEvent
                onSwipedLeft={() => this.onSwiped('LEFT')}
                onSwipedRight={() => this.onSwiped('RIGHT')}
                delta={120}
              >
                <SortedOrders date={this.state.date} />
              </Swipeable>
            )}
          </div>
        </div>
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

export default connect(mapStateToProps, { getSortedOrders })(withRouter(Operator));