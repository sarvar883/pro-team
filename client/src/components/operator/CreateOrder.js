import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import TextFieldGroup from '../common/TextFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import advertisements from '../common/advertisements';
import Select from 'react-select';

import orderTypes from '../common/orderTypes';

import { getCorporateClients, getAllUsers, createOrder } from '../../actions/orderActions';


class CreateOrder extends Component {
  constructor(props) {
    super(props);

    let date, hour;

    if (this.props.location.state) {
      date = this.props.location.state.state.date;
      hour = this.props.location.state.state.hour;
    } else {
      date = '';
      hour = '';
    }

    this.state = {
      disinfectorId: '',
      userAcceptedOrder: '',
      client: '',
      clientType: '',
      clientId: '',

      address: '',
      date: date,
      timeFrom: hour,
      phone: '',
      hasSecondPhone: false,
      phone2: '',
      typeOfService: [],
      advertising: '',
      comment: '',
      errors: {}
    };
  }

  componentDidMount() {
    this.props.getCorporateClients();
    this.props.getAllUsers();
    window.scrollTo({ top: 0 });

    let array = [];

    orderTypes.forEach(object => {
      array.push({
        type: object.value,
        selected: false
      });
    });

    this.setState({
      typeOfService: array
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSelectClientTypeChange = (e) => {
    this.setState({
      clientId: e.value
    });
  };

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
          serviceTypeString = serviceTypeString + ', ' + item.type;
        }
      }
    });



    if (
      this.state.phone.length !== 13 ||
      (this.state.hasSecondPhone && this.state.phone2.length !== 13)
    ) {
      alert('Телефонный номер должен содержать 13 символов. Введите в формате +998XXXXXXXXX');
    } else if (this.state.phone[0] !== '+' || (this.state.hasSecondPhone && this.state.phone2[0] !== '+')) {
      alert('Телефонный номер должен начинаться с "+". Введите в формате +998XXXXXXXXX');
    } else if (numberCharacters !== 12 || (this.state.hasSecondPhone && phone2Characters !== 12)) {
      alert('Телефонный номер должен содержать "+" и 12 цифр');
    } else if (selectedItems === 0) {
      alert('Выберите тип заказа');
    } else if (this.state.clientType === 'corporate' && this.state.clientId === '') {
      alert('Выберите корпоративного клиента');
    } else {

      // find object ответственный дезинфектор
      let respDisinf;
      this.props.order.allUsers.forEach((item, index) => {
        if (item._id === this.state.disinfectorId) {
          respDisinf = item;
          return;
        }
      });

      const newOrder = {
        disinfectorId: this.state.disinfectorId,
        // tgChat: respDisinf.tgChat ? respDisinf.tgChat : '',
        client: this.state.client,
        clientType: this.state.clientType,
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
        userCreated: this.props.auth.user.id,
        userAcceptedOrder: this.state.userAcceptedOrder
      };
      // console.log('order', newOrder);
      this.props.createOrder(newOrder, this.props.history, this.props.auth.user.occupation);
    }
  };

  render() {
    const { errors } = this.state;

    let allUsers = this.props.order.allUsers ? this.props.order.allUsers.sort((x, y) => x.name - y.name) : [];

    const userOptions = [
      { label: '-- Кто принял заказ? --', value: 0 }
    ];
    allUsers.forEach(item => {
      userOptions.push({
        label: `${item.occupation}, ${item.name}`,
        value: item._id
      });
    });

    let disinfectors = allUsers.filter(user => user.occupation === 'disinfector' || user.occupation === 'subadmin');
    const disinfectorOptions = [
      { label: '-- Выберите ответственного дезинфектора --', value: 0 }
    ];
    disinfectors.forEach(worker => disinfectorOptions.push({
      label: `${worker.name}, ${worker.occupation}`, value: worker._id
    }));

    const clientTypes = [
      { label: '-- Выберите тип клиента --', value: '' },
      { label: 'Корпоративный', value: 'corporate' },
      { label: 'Физический', value: 'individual' }
    ];

    const corporateClients = [
      { label: '-- Выберите корпоративного клиента --', value: '' }
    ];
    // sort corporate clients by name in alphabetical order
    let corpClients = this.props.order.corporateClients.sort((a, b) => {
      return a.name === b.name ? 0 : a.name < b.name ? -1 : 1;
    });

    corpClients.forEach(item => {
      corporateClients.push({
        label: item.name,
        value: item._id
      });
    });

    const advOptions = [
      { label: '-- Откуда узнали о нас? --', value: 0 }
    ];
    advertisements.forEach(item => {
      advOptions.push({
        label: item.label,
        value: item.value
      });
    });

    // styles of select corporate client element (Select)
    const colourStyles = {
      control: (styles) => ({
        ...styles,
        backgroundColor: this.props.options.theme === 'dark' ? '#666666' : 'white',
        color: this.props.options.theme === 'dark' ? 'white' : 'black',
      }),
      option: (styles) => ({
        ...styles,
        backgroundColor: this.props.options.theme === 'dark' ? '#212d3b' : 'white',
        color: this.props.options.theme === 'dark' ? 'white' : 'black',
      }),
      placeholder: (styles) => ({
        ...styles,
        color: this.props.options.theme === 'dark' ? 'white' : 'black',
      }),
      singleValue: (styles) => ({
        ...styles,
        color: this.props.options.theme === 'dark' ? 'white' : 'black',
      }),
    };

    return (
      <div className="container create-order mt-4" >
        <div className="row">
          <div className="col-md-8 m-auto">
            <div className="card">
              <div className="card-body">
                <h2 className="text-center">Создать Заказ</h2>
                <form noValidate onSubmit={this.onSubmit}>
                  <SelectListGroup
                    name="clientType"
                    value={this.state.clientType}
                    onChange={this.onChange}
                    options={clientTypes}
                    error={errors.clientType}
                  />

                  {this.state.clientType === 'corporate' ? (
                    // <SelectListGroup
                    //   name="clientId"
                    //   value={this.state.clientId}
                    //   onChange={this.onChange}
                    //   options={corporateClients}
                    //   error={errors.clientId}
                    // />
                    <Select
                      className='select-corporate-client'
                      onChange={this.onSelectClientTypeChange}
                      options={corporateClients}
                      placeholder="Выберите корпоративного клиента"
                      styles={colourStyles}
                    />
                  ) : ''}

                  <TextFieldGroup
                    label="Введите Имя Клиента"
                    type="text"
                    name="client"
                    value={this.state.client}
                    onChange={this.onChange}
                    error={errors.client}
                  />
                  <TextFieldGroup
                    label="Адрес"
                    type="text"
                    name="address"
                    value={this.state.address}
                    onChange={this.onChange}
                    error={errors.address}
                  />
                  <TextFieldGroup
                    label="Телефон"
                    type="phone"
                    name="phone"
                    value={this.state.phone}
                    onChange={this.onChange}
                    error={errors.phone}
                  />
                  {this.state.hasSecondPhone ? (
                    <React.Fragment>
                      <TextFieldGroup
                        label="Запасной Номер Телефона"
                        placeholder="Введите запасной номер телефона"
                        type="phone"
                        name="phone2"
                        value={this.state.phone2}
                        onChange={this.onChange}
                      />
                      <button className="btn btn-danger mb-2" onClick={this.deleteSecondPhone}><i className="fas fa-minus-circle"></i> Убрать запасной номер телефона</button>
                    </React.Fragment>
                  ) : (
                    <button className="btn btn-success mb-3" onClick={this.toggleSecondPhone}><i className="fas fa-plus-circle"></i> Добавить другой номер</button>
                  )}

                  <TextFieldGroup
                    label="Дата выполнения заказа"
                    name="date"
                    type="date"
                    value={this.state.date}
                    onChange={this.onChange}
                    error={errors.date}
                  />
                  <TextFieldGroup
                    label="Время (часы:минуты:AM/PM) C"
                    name="timeFrom"
                    type="time"
                    value={this.state.timeFrom}
                    onChange={this.onChange}
                    error={errors.timeFrom}
                  />
                  {/* <SelectListGroup
                    name="typeOfService"
                    value={this.state.typeOfService}
                    onChange={this.onChange}
                    error={errors.typeOfService}
                    options={orderTypes}
                  /> */}


                  <div className="border-bottom"></div>
                  <label htmlFor="">Выберите тип заказа (можно выбрать несколько):</label>
                  {orderTypes.map((item, key) =>
                    <div className="form-check" key={key}>
                      <label className="form-check-label">
                        <input type="checkbox" className="form-check-input" onChange={this.onChangeTypes} value={item.value} />{item.label}
                      </label>
                    </div>
                  )}
                  <div className="border-bottom"></div>


                  <SelectListGroup
                    name="advertising"
                    value={this.state.advertising}
                    onChange={this.onChange}
                    error={errors.advertising}
                    options={advOptions}
                  />
                  {this.props.order.loading ? (
                    <p>Дезинфекторы загружаются...</p>
                  ) : (
                    <SelectListGroup
                      name="disinfectorId"
                      value={this.state.disinfectorId}
                      onChange={this.onChange}
                      error={errors.disinfectorId}
                      options={disinfectorOptions}
                    />
                  )}
                  <SelectListGroup
                    name="userAcceptedOrder"
                    value={this.state.userAcceptedOrder}
                    onChange={this.onChange}
                    options={userOptions}
                    error={errors.userAcceptedOrder}
                  />
                  <TextAreaFieldGroup
                    name="comment"
                    placeholder="Комментарии (Это поле не обязательное)"
                    value={this.state.comment}
                    onChange={this.onChange}
                    error={errors.comment}
                  />
                  <button type="submit" className="btn btn-success"><i className="fas fa-plus-circle"></i> Создать</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  options: state.options,
  errors: state.errors
});

export default connect(mapStateToProps, { getCorporateClients, getAllUsers, createOrder })(withRouter(CreateOrder));