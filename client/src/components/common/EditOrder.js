import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import isEmpty from '../../validation/is-empty';
import advertisements from '../common/advertisements';

import { getDisinfectors, getAllUsers, getCorporateClients, getOrderForEdit, editOrder } from '../../actions/orderActions';

import orderTypes from '../common/orderTypes';

class EditOrder extends Component {
  state = {
    _id: '',
    disinfectorId: '',
    userAcceptedOrder: '',
    clientType: '',
    client: '',
    clientId: '',

    address: '',
    date: '',
    timeFrom: '',
    phone: '',
    hasSecondPhone: false,
    phone2: '',
    typeOfService: [],
    advertising: '',
    comment: ''
  }

  componentDidMount() {
    this.props.getOrderForEdit(this.props.match.params.orderId);
    this.props.getDisinfectors();
    this.props.getCorporateClients();
    this.props.getAllUsers();
    // window.location.reload();
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.order) {
    //   this.setState({
    //     order: nextProps.order
    //   });
    // }

    if (nextProps.order.orderById) {
      let orderForEdit = nextProps.order.orderById;

      orderForEdit.disinfectorId = !isEmpty(orderForEdit.disinfectorId) ? orderForEdit.disinfectorId : '';

      // orderForEdit.userAcceptedOrder = !isEmpty(orderForEdit.userAcceptedOrder) ? orderForEdit.userAcceptedOrder : '';
      orderForEdit.userAcceptedOrder = orderForEdit.userAcceptedOrder ? orderForEdit.userAcceptedOrder : '';

      orderForEdit.clientType = !isEmpty(orderForEdit.clientType) ? orderForEdit.clientType : '';
      orderForEdit.clientId = !isEmpty(orderForEdit.clientId) ? orderForEdit.clientId : '';

      orderForEdit.client = !isEmpty(orderForEdit.client) ? orderForEdit.client : '';
      orderForEdit.address = !isEmpty(orderForEdit.address) ? orderForEdit.address : '';
      orderForEdit.phone = !isEmpty(orderForEdit.phone) ? orderForEdit.phone : '';
      orderForEdit.typeOfService = !isEmpty(orderForEdit.typeOfService) ? orderForEdit.typeOfService : '';
      orderForEdit.advertising = !isEmpty(orderForEdit.advertising) ? orderForEdit.advertising : '';

      orderForEdit.comment = !isEmpty(orderForEdit.comment) ? orderForEdit.comment : '';

      if (isEmpty(orderForEdit.phone2)) {
        this.setState({
          hasSecondPhone: false
        });
        orderForEdit.phone2 = '';
      } else {
        this.setState({
          hasSecondPhone: true
        });
      }

      const date = !isEmpty(orderForEdit.dateFrom) ? new Date(orderForEdit.dateFrom) : '';

      let defaultDateMonth, defaultDateDay, defaultHourString;
      if (new Date(date).getMonth() < 9) {
        defaultDateMonth = `0${new Date(date).getMonth() + 1}`;
      } else {
        defaultDateMonth = `${new Date(date).getMonth() + 1}`;
      }

      if (new Date(date).getDate() < 10) {
        defaultDateDay = `0${new Date(date).getDate()}`;
      } else {
        defaultDateDay = new Date(date).getDate();
      }
      const defaultDateString = `${new Date(date).getFullYear()}-${defaultDateMonth}-${defaultDateDay}`;

      if (new Date(date).getHours() < 10) {
        defaultHourString = `0${new Date(date).getHours()}:00`;
      } else {
        defaultHourString = `${new Date(date).getHours()}:00`;
      }



      let array = [];
      orderTypes.forEach(object => {
        array.push({
          type: object.value,
          selected: false
        });
      });

      // service type array
      let arraySelectedItems = orderForEdit.typeOfService.split(',');

      array.forEach(item => {
        arraySelectedItems.forEach(element => {
          if (item.type === element) {
            item.selected = true;
          }
        });
      });


      this.setState({
        _id: orderForEdit._id,
        disinfectorId: orderForEdit.disinfectorId._id,
        userAcceptedOrder: orderForEdit.userAcceptedOrder._id,
        clientType: orderForEdit.clientType,
        client: orderForEdit.client,
        clientId: orderForEdit.clientId._id,
        address: orderForEdit.address,
        date: defaultDateString,
        timeFrom: defaultHourString,
        phone: orderForEdit.phone,
        phone2: orderForEdit.phone2,
        typeOfService: array,
        advertising: orderForEdit.advertising,
        comment: orderForEdit.comment
      });
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onChangeTypes = (e) => {
    let array = [...this.state.typeOfService];
    array.forEach(item => {
      if (item.type === e.target.value) {
        item.selected = e.target.checked;
      }
    });

    this.setState({
      typeOfService: array
    });
  }

  toggleSecondPhone = (e) => {
    e.preventDefault();
    this.setState({
      hasSecondPhone: !this.state.hasSecondPhone
    });
  }

  deleteSecondPhone = (e) => {
    e.preventDefault();
    this.setState({
      hasSecondPhone: false,
      phone2: ''
    });
  }

  onSubmit = (e) => {
    e.preventDefault();

    const date = this.state.date.split('-');
    const dateStringFrom = new Date(`${date[1]}-${date[2]}-${date[0]} ${this.state.timeFrom}`);

    let numberCharacters = 0, phone2Characters = 0;
    for (let i = 1; i <= 12; i++) {
      if (this.state.phone[i] >= '0' && this.state.phone[i] <= '9') {
        numberCharacters++;
      }
      if (this.state.phone2[i] >= '0' && this.state.phone2[i] <= '9') {
        phone2Characters++;
      }
    }

    let serviceTypeString = '', selectedItems = 0;
    this.state.typeOfService.forEach(item => {
      if (item.selected) {
        selectedItems++;
        if (selectedItems === 1) {
          serviceTypeString = serviceTypeString + item.type;
        } else {
          serviceTypeString = serviceTypeString + ',' + item.type;
        }
      }
    });

    if (this.state.phone.length !== 13 || (this.state.hasSecondPhone && this.state.phone2.length !== 13)) {
      alert('Телефонный номер должен содержать 13 символов. Введите в формате +998XXXXXXXXX');
    } else if (this.state.phone[0] !== '+' || (this.state.hasSecondPhone && this.state.phone2[0] !== '+')) {
      alert('Телефонный номер должен начинаться с "+". Введите в формате +998XXXXXXXXX');
    } else if (numberCharacters !== 12 || (this.state.hasSecondPhone && phone2Characters !== 12)) {
      alert('Телефонный номер должен содержать "+" и 12 цифр');
    } else if (selectedItems === 0) {
      alert('Выберите тип заказа');
    } else {
      const order = {
        _id: this.state._id,
        disinfectorId: this.state.disinfectorId,
        userAcceptedOrder: this.state.userAcceptedOrder,
        clientType: this.state.clientType,
        client: this.state.client,
        clientId: this.state.clientId,
        address: this.state.address,
        date: this.state.date,
        dateFrom: dateStringFrom,
        timeFrom: this.state.timeFrom,
        phone: this.state.phone,
        phone2: this.state.phone2,
        typeOfService: serviceTypeString,
        advertising: this.state.advertising,
        comment: this.state.comment,
      };
      this.props.editOrder(order, this.props.history, this.props.auth.user.occupation);
    }
  }

  render() {

    let allUsers = this.props.order.allUsers ? this.props.order.allUsers.sort((x, y) => x.name - y.name) : [];
    const userOptions = [
      { label: '-- Кто принял заказ? --', value: '' }
    ];
    allUsers.forEach(item => {
      userOptions.push({
        label: `${item.occupation}, ${item.name}`,
        value: item._id
      });
    });

    let disinfectors = allUsers.filter(user => user.occupation === 'disinfector' || user.occupation === 'subadmin');
    let disinfectorOptions = [
      { label: '-- Выберите ответственного дезинфектора --', value: '' }
    ];
    disinfectors.forEach(worker => disinfectorOptions.push(
      { label: `${worker.name}, ${worker.occupation}`, value: worker._id }
    ));

    const clientTypes = [
      { label: '-- Выберите тип клиента --', value: '' },
      { label: 'Корпоративный', value: 'corporate' },
      { label: 'Физический', value: 'individual' }
    ];

    const corporateClients = [
      { label: '-- Выберите корпоративного клиента --', value: '' }
    ];
    // sort clients alphabetically
    let sortedCorpClients = this.props.order.corporateClients.sort((a, b) => {
      if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
      if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
      return 0;
    });
    sortedCorpClients.forEach(item => {
      corporateClients.push({
        label: item.name,
        value: item._id
      });
    });

    const advOptions = [
      { label: '-- Откуда узнали о нас? --', value: '' }
    ];

    advertisements.forEach(item => {
      advOptions.push({
        label: item.label,
        value: item.value
      });
    });

    let renderServiceTypes = this.state.typeOfService.map((item, key) =>
      <div className="form-check" key={key}>
        <label className="form-check-label">
          {item.selected ?
            <React.Fragment>
              <input type="checkbox" defaultChecked="checked" className="form-check-input" onChange={this.onChangeTypes} value={item.type} />{item.type}
            </React.Fragment> :
            <React.Fragment>
              <input type="checkbox" className="form-check-input" onChange={this.onChangeTypes} value={item.type} />{item.type}
            </React.Fragment>}
        </label>
      </div>
    );

    return (
      <React.Fragment>
        {this.props.order.loading ? <Spinner /> : (
          <div className="container edit-order mt-4">
            <div className="row">
              <div className="col-md-8 m-auto">
                <div className="card">
                  <div className="card-body">
                    <h1 className="display-5 text-center">Редактировать Заказ</h1>
                    <form onSubmit={this.onSubmit}>
                      <div className="form-group">
                        <label htmlFor="clientType">Выберите Тип Клиента:</label>
                        <select className="form-control" value={this.state.clientType} name="clientType" onChange={this.onChange} required>
                          {clientTypes.map((item, index) =>
                            <option key={index} value={item.value}>{item.label}</option>
                          )}
                        </select>
                      </div>

                      {this.state.clientType === 'corporate' ? (
                        <div className="form-group">
                          <label htmlFor="clientId">Выберите Корпоративного Клиента:</label>
                          <select className="form-control" value={this.state.clientId} name="clientId" onChange={this.onChange} required>
                            {corporateClients.map((item, index) =>
                              <option key={index} value={item.value}>{item.label}</option>
                            )}
                          </select>
                        </div>
                      ) : ''}

                      <TextFieldGroup
                        label="Введите Имя Клиента:"
                        type="text"
                        name="client"
                        value={this.state.client}
                        onChange={this.onChange}
                        required
                      />
                      <TextFieldGroup
                        label="Адрес"
                        type="text"
                        name="address"
                        value={this.state.address}
                        onChange={this.onChange}
                        required
                      />
                      <TextFieldGroup
                        label="Телефон"
                        type="phone"
                        name="phone"
                        value={this.state.phone}
                        onChange={this.onChange}
                        required
                      />

                      {this.state.hasSecondPhone ? (
                        <React.Fragment>
                          <TextFieldGroup
                            label="Другой Номер Телефона"
                            placeholder="Введите запасной номер телефона"
                            type="phone"
                            name="phone2"
                            value={this.state.phone2}
                            onChange={this.onChange}
                            required
                          />
                          <button className="btn btn-danger mb-2" onClick={this.deleteSecondPhone}>Убрать запасной номер телефона</button>
                        </React.Fragment>
                      ) : (
                          <button className="btn btn-success mb-3" onClick={this.toggleSecondPhone}>Добавить другой номер</button>
                        )}

                      <TextFieldGroup
                        label="Дата выполнения заказа"
                        name="date"
                        type="date"
                        value={this.state.date}
                        onChange={this.onChange}
                        required
                      />
                      <TextFieldGroup
                        label="Время (часы:минуты:AM/PM) C"
                        name="timeFrom"
                        type="time"
                        value={this.state.timeFrom}
                        onChange={this.onChange}
                        required
                      />

                      {/* <div className="form-group">
                        <label htmlFor="typeOfService">Выберите Тип Заказа:</label>
                        <select className="form-control" value={this.state.typeOfService} name="typeOfService" onChange={this.onChange} required>
                          {orderTypes.map((item, index) =>
                            <option key={index} value={item.value}>{item.label}</option>
                          )}
                        </select>
                      </div> */}

                      <label htmlFor="">Выберите тип заказа (можно выбрать несколько):</label>
                      {renderServiceTypes}

                      <div className="form-group">
                        <label htmlFor="advertising">Откуда Узнали:</label>
                        <select className="form-control" value={this.state.advertising} name="advertising" onChange={this.onChange} required>
                          {advOptions.map((item, index) =>
                            <option key={index} value={item.value}>{item.label}</option>
                          )}
                        </select>
                      </div>

                      {this.props.order.loading ? (
                        <p>Дезинфекторы загружаются...</p>
                      ) : (
                          <div className="form-group">
                            <label htmlFor="disinfectorId">Выберите Дезинфектора:</label>
                            <select className="form-control" value={this.state.disinfectorId} name="disinfectorId" onChange={this.onChange} required>
                              {disinfectorOptions.map((item, index) =>
                                <option key={index} value={item.value}>{item.label}</option>
                              )}
                            </select>
                          </div>
                        )}


                      <div className="form-group">
                        <label htmlFor="userAcceptedOrder">Кто принял заказ:</label>
                        <select className="form-control" value={this.state.userAcceptedOrder} name="userAcceptedOrder" onChange={this.onChange} required>
                          {userOptions.map((item, index) =>
                            <option key={index} value={item.value}>{item.label}</option>
                          )}
                        </select>
                      </div>

                      <TextAreaFieldGroup
                        name="comment"
                        placeholder="Комментарии (Это поле не обязательное)"
                        value={this.state.comment}
                        onChange={this.onChange}
                        required
                      />
                      <button type="submit" className="btn btn-primary">Редактировать</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
  order: state.order,
  errors: state.errors
});

export default connect(mapStateToProps, { getDisinfectors, getAllUsers, getCorporateClients, getOrderForEdit, editOrder })(withRouter(EditOrder));