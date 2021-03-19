import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import getContractsString from '../../utils/getContractString';

import ClientOrders from './ClientOrders';
import { clientById, changeContractNumbers, getOrdersOfClient } from '../../actions/adminActions';


import { getWeekDays, getWeekRange } from '../common/weekFunc';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';


class ClientId extends Component {
  state = {
    client: {
      orders: [],
      contracts: []
    },
    contract: '',

    // -----
    searchMethod: '',
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
    this.props.clientById(this.props.match.params.clientId);
    window.scrollTo({ top: 0 })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.admin.clientById) {
      this.setState({
        client: nextProps.admin.clientById
      });
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  handleContractCRUD = (method, contract) => {
    const object = {
      // client ID
      id: this.state.client._id,
      method, contract
    };
    this.props.changeContractNumbers(object, this.props.history);
  };

  onSubmit = (e) => {
    e.preventDefault();
    const object = {
      // client ID
      id: this.state.client._id,
      method: 'add',
      contract: this.state.contract
    };
    this.props.changeContractNumbers(object, this.props.history);
    this.setState({
      contract: ''
    });
  };

  getOrdersOfClientDay = (e) => {
    e.preventDefault();
    const object = {
      client: {
        id: this.state.client._id,
        type: this.state.client.type,
        name: this.state.client.name,
        phone: this.state.client.phone || ''
      },
      type: 'day',
      day: this.state.day
    };
    this.props.getOrdersOfClient(object);

    this.setState({
      searchMethod: 'day',
      headingDay: this.state.day.split('-').reverse().join('-')
    });
  };



  // weekly calendar
  handleDayChange = date => {
    const object = {
      client: {
        id: this.state.client._id,
        type: this.state.client.type,
        name: this.state.client.name,
        phone: this.state.client.phone || ''
      },
      type: 'week',
      days: getWeekDays(getWeekRange(date).from)
    };
    this.props.getOrdersOfClient(object);

    this.setState({
      searchMethod: 'week',
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
      client: {
        id: this.state.client._id,
        type: this.state.client.type,
        name: this.state.client.name,
        phone: this.state.client.phone || ''
      },
      type: 'week',
      days: getWeekDays(getWeekRange(days[0]).from)
    };
    this.props.getOrdersOfClient(object);

    this.setState({
      searchMethod: 'week',
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


    const { client } = this.state;

    let totalSum = 0,
      totalScore = 0,
      operatorDecidedOrders = [],
      confirmedOrders = [],
      rejectedOrders = [];

    // let clientOrders = client.orders.map((item, key) => {
    client.orders.forEach(item => {
      if (item.completed && item.operatorDecided) {
        operatorDecidedOrders.push(item);

        if (item.operatorConfirmed && (item.adminConfirmed || item.accountantConfirmed)) {
          confirmedOrders.push(item);
          totalSum += item.cost;
          totalScore += item.score;
        }

        if (item.clientType === 'corporate') {
          if (!item.operatorConfirmed || (item.accountantDecided && !item.accountantConfirmed)) {
            rejectedOrders.push(item);
          }
        } else if (item.clientType === 'individual') {
          if (!item.operatorConfirmed || (item.adminDecided && !item.adminConfirmed)) {
            rejectedOrders.push(item);
          }
        }
      }

    });


    // RENDER ORDER DATES --------
    // display dates of orders with col-md-4 and 10 dates in one box
    const DATES_IN_ONE_BOX = 10;
    // number of orders that have orderFrom field
    let number_of_dates = 0;
    client.orders.forEach(order => {
      if (order.dateFrom) number_of_dates++;
    });

    // how many boxes are needed
    let number_of_boxes = Math.ceil(number_of_dates / DATES_IN_ONE_BOX);

    let array_of_objects = [];
    for (let i = 1; i <= number_of_boxes; i++) {
      array_of_objects.push({});
    }

    let renderBoxes = array_of_objects.map((item, index) => {
      let datesArray = [];
      for (let j = index * 10; j <= index * 10 + 9; j++) {
        if (client.orders[j] && client.orders[j].dateFrom) {
          datesArray.push(client.orders[j].dateFrom);
        }
      }
      datesArray.sort((x, y) => new Date(x) - new Date(y));

      return (
        <div className="col-md-4" key={index}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 pl-0 list-unstyled">
                {datesArray.map((el, key) => <li key={key}><Moment format="DD/MM/YYYY HH:mm">{el}</Moment></li>)}
              </ul>
            </div>
          </div>
        </div>
      );
    });
    // RENDER ORDER DATES --------


    let renderExistingContracts = client.contracts.map((item, index) =>
      <li className="mb-3" key={index}>Договор: {item} <button className="btn btn-danger ml-3" onClick={() => this.handleContractCRUD('delete', item)}>Удалить</button></li>
    );

    return (
      <div className="container-fluid">

        {this.props.admin.loadingClients ? (
          <div className="row mt-3">
            <div className="col-12">
              <Spinner />
            </div>
          </div>
        ) : (
          <React.Fragment>
            <div className="row">
              <div className="col-12">
                <h3 className="text-center">Клиент {client.name}</h3>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-lg-4 col-md-6">
                <div className="card order mt-2">
                  <div className="card-body p-0">
                    <ul className="font-bold mb-0 pl-0 list-unstyled">
                      {client.type === 'corporate' ?
                        <React.Fragment>
                          <li>Корпоративный клиент: {client.name}</li>
                          <li>ИНН: {client.inn || '--'}</li>
                          <li>Номера Договоров: {getContractsString(client.contracts)}</li>
                        </React.Fragment>
                        : ''}

                      {client.type === 'individual' ?
                        <React.Fragment>
                          <li>Физический клиент: {client.name}</li>
                          <li>Номер телефона: {client.phone}</li>
                          <li>Адрес: {client.address}</li>
                        </React.Fragment> : ''}

                      <li>Всего Получено заказов от клиента: {client.orders.length}</li>

                      {confirmedOrders.length > 0 &&
                        <li>Выполнено и подтверждено заказов: {confirmedOrders.length}</li>
                      }

                      {totalScore > 0 &&
                        <li>Средняя оценка: {(totalScore / confirmedOrders.length).toFixed(2)} (из 5)</li>
                      }

                      {totalSum > 0 &&
                        <li>Общая Сумма: {totalSum.toLocaleString()} UZS</li>
                      }
                    </ul>
                    <Link to={`/edit-client/${client._id}`} className="btn btn-warning mt-2">Редактировать Клиента</Link>
                  </div>
                </div>
              </div>

              {client.type === 'corporate' ? (
                <React.Fragment>
                  <div className="col-lg-4 col-md-6">
                    <div className="card order mt-2">
                      <div className="card-body p-0">
                        <h5 className="text-center">Удалить Номер Договора</h5>
                        <ul className="font-bold mb-0 pl-0 list-unstyled">
                          {renderExistingContracts}
                        </ul>
                      </div>
                    </div>
                  </div>


                  <div className="col-lg-4 col-md-6">
                    <div className="card order mt-2">
                      <div className="card-body p-0">
                        <form onSubmit={this.onSubmit}>
                          <h5 className="text-center">Добавить Номер Договора</h5>
                          <div className="form-group">
                            <input type="text" name="contract" className="form-control" onChange={this.onChange} value={this.state.contract} placeholder="Введите Номер Договора" required />
                          </div>
                          <button type="submit" className="btn btn-success">Добавить</button>
                        </form>
                      </div>
                    </div>
                  </div>

                </React.Fragment>
              ) : ''}
            </div>
          </React.Fragment>
        )}

        {client.orders.length > 0 && typeof client.orders[0] === 'object' && (
          <React.Fragment>
            <div className="border-between-disinfectors mt-3"></div>
            <div className="border-between-disinfectors mt-1"></div>

            <div className="row">
              <div className="col-12">
                <h2 className="text-center pl-3 pr-3">Даты Заказов Клиента</h2>
              </div>
            </div>

            <div className="row">
              {renderBoxes}
            </div>

            <div className="border-between-disinfectors mt-3"></div>
            <div className="border-between-disinfectors mt-1"></div>
          </React.Fragment>
        )}


        <div className="row">

          <div className="col-lg-4 col-md-6 mt-3">
            <form onSubmit={this.getOrdersOfClientDay} className="form-bg p-2">
              <h4 className="text-center">Заказы клиента по дням</h4>
              <div className="form-group">
                <label htmlFor="day"><strong>Выберите День:</strong></label>
                <input type="date" name="day" className="form-control" onChange={this.onChange} required />
              </div>
              <button type="submit" className="btn btn-primary">Искать</button>
            </form>
          </div>


          <div className="col-lg-4 col-md-6 weekly-stats mt-3">
            <div className="SelectedWeekExample form-bg font-weight-bold">
              <h4 className="text-center">Заказы клиента по неделям</h4>
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
            {this.state.searchMethod === 'week' ?
              <h2 className="text-center pl-3 pr-3">Заказы клиента за <Moment format="DD/MM/YYYY">{this.state.selectedDays[0]}</Moment> - <Moment format="DD/MM/YYYY">{this.state.selectedDays[6]}</Moment></h2> : ''}

            {this.state.searchMethod === 'day' ?
              <h2 className="text-center pl-3 pr-3">Заказы клиента за {this.state.headingDay}</h2> : ''}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {this.props.admin.loadingOrdersOfClient ? <Spinner /> : (
              <React.Fragment>
                {this.state.searchMethod !== '' && (
                  <ClientOrders />
                )}
              </React.Fragment>
            )}
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

export default connect(mapStateToProps, { clientById, changeContractNumbers, getOrdersOfClient })(withRouter(ClientId));