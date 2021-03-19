import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import advertisements from '../common/advertisements';

import { getAdvStats } from '../../actions/adminActions';
import monthsNames from '../common/monthNames';
import getMonthAndYearLabels from '../../utils/monthAndYearLabels';
import returnMonthAndYear from '../../utils/returnMonthAndYear';


class AdvStats extends Component {
  state = {
    type: '',
    month: '',
    year: '',
    orders: [],

    // to display month and year in heading
    headingMonth: '',
    headingYear: ''
  };

  componentDidMount() {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    this.setState({
      type: 'month',
      month: thisMonth,
      year: thisYear,
      headingMonth: thisMonth,
      headingYear: thisYear,
    });

    const object = {
      type: 'month',
      month: thisMonth,
      year: thisYear
    };
    this.props.getAdvStats(object);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      orders: nextProps.admin.stats.orders
    });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  allTimeStats = () => {
    this.setState({
      type: 'allTime',
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    });
    const object = {
      type: 'allTime',
      month: Number(this.state.month),
      year: Number(this.state.year)
    };
    this.props.getAdvStats(object);
  }

  getMonthStats = (e) => {
    e.preventDefault();
    this.setState({
      type: 'month',
      headingMonth: Number(this.state.month),
      headingYear: Number(this.state.year)
    });
    const object = {
      type: 'month',
      month: Number(this.state.month),
      year: Number(this.state.year)
    };
    this.props.getAdvStats(object);
  }

  getSpecificMonthStats = (param) => {
    const { month, year } = returnMonthAndYear(param);

    const object = { type: 'month', month, year };

    this.props.getAdvStats(object);

    this.setState({
      type: 'month',
      headingMonth: month,
      headingYear: year
    });
  };

  getYearStats = (e) => {
    e.preventDefault();
    this.setState({
      type: 'year',
      headingYear: Number(this.state.year)
    });
    const object = {
      type: 'year',
      month: Number(this.state.month),
      year: Number(this.state.year)
    };

    this.props.getAdvStats(object);
  }

  render() {
    const { monthLabels, yearLabels } = getMonthAndYearLabels();

    const yearsOptions = yearLabels.map((year, index) =>
      <option value={year.value} key={index}>{year.label}</option>
    );
    const monthOptions = monthLabels.map((month, index) =>
      <option value={month.value} key={index}>{month.label}</option>
    );

    let advArray = [];
    advertisements.forEach(item => {
      advArray.push({
        name: item.value,
        quantity: 0,
        orders: [],
        completed: 0,
        confirmed: 0,
        rejected: 0,
        failed: 0,
        totalSum: 0,
        totalScore: 0
      });
    });

    if (this.state.orders) {
      this.state.orders.forEach(order => {
        advArray.forEach(item => {
          if (order.advertising === item.name) {
            item.quantity++;
            item.orders.push(order);

            if (order.completed) {
              item.completed++;

              if (order.clientType === 'corporate') {
                if (order.completed && order.operatorConfirmed && order.accountantConfirmed) {
                  item.confirmed++;
                  item.totalSum += order.cost;
                  item.totalScore += order.score;
                }

                // if (!order.operatorConfirmed || !order.accountantConfirmed) {
                if (order.completed && ((order.operatorDecided && !order.operatorConfirmed) || (order.accountantDecided && !order.accountantConfirmed))) {
                  item.rejected++;
                }

              }

              if (order.clientType === 'individual') {
                if (order.completed && order.operatorConfirmed && order.adminConfirmed) {
                  item.confirmed++;
                  item.totalSum += order.cost;
                  item.totalScore += order.score;
                }

                // if (!order.operatorConfirmed || !order.adminConfirmed) {
                if (order.completed &&
                  (
                    (order.operatorDecided && !order.operatorConfirmed) ||
                    (order.adminDecided && !order.adminConfirmed)
                  )
                ) {
                  item.rejected++;
                }

                if (order.failed) {
                  item.failed++;
                }
              }
            }
          }
        });
      });
    }

    advArray.sort((a, b) => b.quantity - a.quantity);

    let renderAdvGeneral = advArray.map((item, index) => {
      return (
        <div className="col-lg-4 col-md-6 mt-3" key={index}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <h3 className="text-center">{item.name}</h3>
              <ul className="font-bold mb-0 list-unstyled">
                <li>Получено заказов: {item.quantity}</li>
                <li>Выполнено заказов: {item.completed}</li>
                <li>Подтверждено заказов: {item.confirmed}</li>
                <li>На общую сумму: {item.totalSum.toLocaleString()} UZS</li>
                <li>Средний балл: {(item.totalScore / item.confirmed).toFixed(2)} (из 5)</li>
                <li>Отвергнуто заказов: {item.rejected}</li>
                <li>Некачественные заказы: {item.failed}</li>
              </ul>
            </div>
          </div>
        </div>
      )
    });

    return (
      <div className="container-fluid mt-1 p-0">
        <div className="row m-0 p-0">
          <div className="col-lg-5 col-md-7">
            <form onSubmit={this.getMonthStats} className="form-bg p-2">
              <div className="form-group">
                <select name="year" className="form-control" onChange={this.onChange} required>
                  {yearsOptions}
                </select>
              </div>
              <div className="form-group">
                <select name="month" className="form-control" onChange={this.onChange} required>
                  {monthOptions}
                </select>
              </div>
              <button type="submit" className="btn btn-success mr-1 mt-1">Показать</button>

              <button type="button" className="btn btn-danger mr-1 mt-1" onClick={() => this.getSpecificMonthStats('current')}>Этот месяц</button>

              <button type="button" className="btn btn-primary mr-1 mt-1" onClick={() => this.getSpecificMonthStats('previous')} >Прошлый месяц</button>
            </form>
          </div>
        </div>

        <div className="row m-0">
          <div className="col-12 mt-3">
            {this.state.type === 'month' ? <h2 className="text-center">Статистика рекламы за {monthsNames[this.state.headingMonth]}, {this.state.headingYear}</h2> : ''}

            {this.state.type === 'year' ? <h2 className="text-center">Статистика рекламы за {this.state.headingYear} год</h2> : ''}

            {this.state.type === 'allTime' ? <h2 className="text-center">Статистика рекламы за все время</h2> : ''}
          </div>
        </div>

        {this.props.admin.loadingStats ? <Spinner /> : (
          <div className="row m-0">
            {renderAdvGeneral}
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
  order: state.order,
  errors: state.errors
});

export default connect(mapStateToProps, { getAdvStats })(withRouter(AdvStats));