import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import advertisements from '../common/advertisements';

import { getAllUsers, getRepeatOrderForm, createRepeatOrder } from '../../actions/orderActions';

class CreateRepeatOrder extends Component {
  state = {
    disinfectorId: '',
    userAcceptedOrder: '',
    client: '',
    clientType: '',
    clientId: '',

    address: '',
    date: '',
    timeFrom: '',
    phone: '',
    hasSecondPhone: false,
    phone2: '',
    typeOfService: '',
    advertising: '',
    comment: ''
  };

  componentDidMount() {
    this.props.getRepeatOrderForm(this.props.match.params.orderId);
    this.props.getAllUsers();
    window.scrollTo({ top: 0 });
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.order.repeatOrder) {
      let newOrder = nextProps.order.repeatOrder;

      if (!newOrder.phone2 || newOrder.phone2 === '') {
        this.setState({
          hasSecondPhone: false
        });
      } else {
        this.setState({
          hasSecondPhone: true,
          phone2: newOrder.phone2
        });
      }

      this.setState({
        disinfectorId: newOrder.disinfectorId._id ? newOrder.disinfectorId._id : '',
        clientType: newOrder.clientType ? newOrder.clientType : '',
        client: newOrder.client ? newOrder.client : '',
        clientId: newOrder.clientId ? newOrder.clientId._id : '',

        address: newOrder.address ? newOrder.address : '',
        phone: newOrder.phone ? newOrder.phone : '',
        typeOfService: newOrder.typeOfService ? newOrder.typeOfService : '',
        advertising: newOrder.advertising ? newOrder.advertising : '',
        userAcceptedOrder: newOrder.userAcceptedOrder ? newOrder.userAcceptedOrder._id : '',
      });
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

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

    if (this.state.phone.length !== 13 || (this.state.hasSecondPhone && this.state.phone2.length !== 13)) {
      alert('Телефонный номер должен содержать 13 символов. Введите в формате +998XXXXXXXXX');
    } else if (this.state.phone[0] !== '+' || (this.state.hasSecondPhone && this.state.phone2[0] !== '+')) {
      alert('Телефонный номер должен начинаться с "+". Введите в формате +998XXXXXXXXX');
    } else if (numberCharacters !== 12 || (this.state.hasSecondPhone && phone2Characters !== 12)) {
      alert('Телефонный номер должен содержать "+" и 12 цифр');
    } else {
      const newOrder = {
        id: this.props.match.params.orderId,
        disinfectorId: this.state.disinfectorId,
        clientType: this.state.clientType,
        client: this.state.client,
        clientId: this.state.clientId,

        address: this.state.address,
        date: this.state.date,
        dateFrom: dateStringFrom,
        timeFrom: this.state.timeFrom,
        phone: this.state.phone,
        phone2: this.state.phone2,
        typeOfService: this.state.typeOfService,
        advertising: this.state.advertising,
        comment: this.state.comment,
        userCreated: this.props.auth.user.id,
        userAcceptedOrder: this.state.userAcceptedOrder
      };
      this.props.createRepeatOrder(newOrder, this.props.history, this.props.auth.user.occupation);
    }
  }

  render() {
    let allUsers = this.props.order.allUsers ? this.props.order.allUsers.sort((x, y) => x.name - y.name) : [];
    const userOptions = [
      { label: '-- Кто принял заказ? --', value: "" }
    ];
    allUsers.forEach(item => {
      userOptions.push({
        label: `${item.occupation}, ${item.name}`,
        value: item._id
      });
    });

    let disinfectors = allUsers.filter(user => user.occupation === 'disinfector' || user.occupation === 'subadmin');
    const disinfectorOptions = [
      { label: '-- Выберите ответственного дезинфектора --', value: "" }
    ];
    disinfectors.forEach(worker => disinfectorOptions.push({
      label: `${worker.name}, ${worker.occupation}`, value: worker._id
    }));

    const orderTypes = [
      { label: '-- Выберите тип заказа --', value: "" },
      { label: 'DF', value: 'DF' },
      { label: 'DZ', value: 'DZ' },
      { label: 'KL', value: 'KL' },
      { label: 'TR', value: 'TR' },
      { label: 'GR', value: 'GR' },
      { label: 'MX', value: 'MX' },
      { label: 'KOMP', value: 'KOMP' }
    ];

    const advOptions = [
      { label: '-- Откуда узнали о нас? --', value: "" }
    ];

    advertisements.forEach(item => {
      advOptions.push({
        label: item.label,
        value: item.value
      });
    });

    return (
      <React.Fragment>
        {this.props.order.loadingRepeatOrder ? <Spinner /> : (
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-8 m-auto">
                <div className="card">
                  <div className="card-body">
                    <h1 className="display-5 text-center">Создать Повторный Заказ</h1>
                    <form onSubmit={this.onSubmit}>
                      {this.state.clientType === 'corporate' ? (
                        <p>Корпоративный Клиент: {this.props.order.repeatOrder.clientId.name}</p>
                      ) : ''}

                      {this.state.clientType === 'individual' ? (
                        <p>Физический Клиент</p>
                      ) : ''}

                      <TextFieldGroup
                        label="Введите Имя Клиента"
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
                        label="Дата выполнения заказа"
                        name="date"
                        type="date"
                        onChange={this.onChange}
                        required
                      />
                      <TextFieldGroup
                        label="Время (часы:минуты:AM/PM) C"
                        name="timeFrom"
                        type="time"
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
                            label="Запасной Номер Телефона"
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

                      <div className="form-group">
                        <label htmlFor="typeOfService">Выберите тип заказа:</label>
                        <select className="form-control" value={this.state.typeOfService} name="typeOfService" onChange={this.onChange} required>
                          {orderTypes.map((item, index) =>
                            <option key={index} value={item.value}>{item.label}</option>
                          )}
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="advertising">Откуда узнали:</label>
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
                        <label htmlFor="userAcceptedOrder">Кто принял Заказ:</label>
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
                      <button type="submit" className="btn btn-primary">Создать Повторный Заказ</button>
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
  operator: state.operator,
  order: state.order,
  errors: state.errors
});

export default connect(mapStateToProps, { getAllUsers, getRepeatOrderForm, createRepeatOrder })(withRouter(CreateRepeatOrder));