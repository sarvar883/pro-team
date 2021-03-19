import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';
import isEmpty from '../../validation/is-empty';

import { getUserById, editUser } from '../../actions/adminActions';

class EditUser extends Component {
  state = {
    loading: true,

    userId: '',
    name: '',
    email: '',
    phone: '',
    occupation: '',
    color: '',

    birthday: '',
    married: '',
    hasChildren: '',
    children: ''
  };

  componentDidMount() {
    this.props.getUserById(this.props.match.params.userId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.admin.userById) {
      this.setState({
        userId: nextProps.admin.userById._id,
        name: nextProps.admin.userById.name,
        email: nextProps.admin.userById.email,
        phone: nextProps.admin.userById.phone,
        occupation: nextProps.admin.userById.occupation,
        color: nextProps.admin.userById.color,
        loading: false
      });
    }

    let userForEdit = nextProps.admin.userById;
    userForEdit.birthday = !isEmpty(userForEdit.birthday) ? new Date(userForEdit.birthday) : '';
    userForEdit.married = !isEmpty(userForEdit.married) ? userForEdit.married : '';
    userForEdit.hasChildren = !isEmpty(userForEdit.hasChildren) ? userForEdit.hasChildren : '';
    userForEdit.children = !isEmpty(userForEdit.children) ? userForEdit.children : '';

    let defaultDateMonth, defaultDateDay, defaultDateString;
    if (new Date(userForEdit.birthday).getMonth() < 9) {
      defaultDateMonth = `0${new Date(userForEdit.birthday).getMonth() + 1}`;
    } else {
      defaultDateMonth = `${new Date(userForEdit.birthday).getMonth() + 1}`;
    }

    if (new Date(userForEdit.birthday).getDate() < 10) {
      defaultDateDay = `0${new Date(userForEdit.birthday).getDate()}`;
    } else {
      defaultDateDay = new Date(userForEdit.birthday).getDate();
    }

    if (userForEdit.birthday) {
      defaultDateString = `${new Date(userForEdit.birthday).getFullYear()}-${defaultDateMonth}-${defaultDateDay}`;
    }

    let married, hasChildren;
    if (userForEdit.married === true) {
      married = 'yes';
    } else if (userForEdit.married === false) {
      married = 'no';
    }

    if (userForEdit.hasChildren === true) {
      hasChildren = 'yes';
    } else if (userForEdit.hasChildren === false) {
      hasChildren = 'no';
    }

    this.setState({
      birthday: defaultDateString,
      married: married,
      hasChildren: hasChildren,
      children: userForEdit.hasChildren ? userForEdit.children : ''
    });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();
    let children;
    if (this.state.hasChildren === 'no') {
      children = 0;
    } else if (this.state.hasChildren === 'yes') {
      children = Number(this.state.children);
    }
    const object = {
      userId: this.state.userId,
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      occupation: this.state.occupation,
      color: this.state.color,
      birthday: new Date(this.state.birthday),
      married: this.state.married === 'yes' ? true : false,
      hasChildren: this.state.hasChildren === 'yes' ? true : false,
      children: children
    };
    this.props.editUser(object, this.props.history);
  }

  render() {

    // user occupation options
    const occupationOptions = [
      { label: '-- Выберите должность пользователя --', value: '' },
      { label: 'Админ', value: 'admin' },
      { label: 'Субадмин', value: 'subadmin' },
      { label: 'Оператор', value: 'operator' },
      { label: 'Дезинфектор', value: 'disinfector' },
      { label: 'Маркетолог', value: 'marketer' },
      { label: 'Бухгалтер', value: 'accountant' }
    ];

    const colorOptions = [
      { label: '-- Выберите цвет пользователя (для календаря) --', value: '' },
      { label: 'Красный', value: 'red' },
      { label: 'Зеленый', value: 'green' },
      { label: 'Синий', value: 'blue' },
      { label: 'Оранжевый', value: 'orange' },
      { label: 'Желтый', value: 'yellow' },
      { label: 'Фиолетовый', value: 'violet' },
      { label: 'Коричневый', value: 'brown' },
      { label: 'Золотой', value: 'gold' },
      { label: 'Желто-зеленый', value: 'greenyellow' },
      { label: 'Индиго', value: 'indigo' },
      { label: 'Светло-Синий', value: 'lightsteelblue' },
      { label: 'Орхидея', value: 'orchid' },
      { label: 'Цвет морской волны', value: 'seagreen' },
      { label: 'Бирюзовый', value: 'turquoise' },
      { label: 'Фора', value: 'bisque' },
      { label: 'Сиян', value: 'cyan' },
      { label: 'DarkGoldenRod', value: 'darkgoldenrod' }
    ];

    let renderUser = (
      <div className="col-lg-6 col-md-8 m-auto">
        <div className="card order mt-2">
          <div className="card-body p-0">
            <ul className="font-bold mb-0 list-unstyled">
              <li>Имя: {this.state.name}</li>
              <li>E-mail: {this.state.email}</li>
              <li>Телефон: {this.state.phone}</li>
              <li>Должность: {this.state.occupation}</li>
              <li>Цвет (в календаре): {this.state.color ? this.state.color : '--'}</li>
              <li>Дата Рождения: {this.state.birthday ? <Moment format="DD/MM/YYYY">{this.state.birthday}</Moment> : '--'}</li>
              {}
              <li>Женат / Замужем ? {this.state.married === 'yes' ? 'Да' : 'Нет'}</li>
              <li>Есть ли дети ? {this.state.hasChildren === 'yes' ? 'Да' : 'Нет'}</li>
              {this.state.hasChildren === 'yes' ? <li>Количество детей: {this.state.children}</li> : ''}
            </ul>
          </div>
        </div>
      </div>
    );

    return (
      <div className="container-fluid">
        {this.state.loading ? <Spinner /> : (
          <div className="row">
            {renderUser}
          </div>
        )}

        <div className="row mt-3">
          <div className="col-lg-6 col-md-8 m-auto">
            <div className="card">
              <div className="card-body">
                <h3 className="display-5 text-center">Редактировать Пользователя</h3>
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Имя Пользователя:</label>
                    <input type="text" name="name" className="form-control" onChange={this.onChange} value={this.state.name} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Пользователя:</label>
                    <input type="email" name="email" className="form-control" onChange={this.onChange} value={this.state.email} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Телефон:</label>
                    <input type="text" name="phone" className="form-control" onChange={this.onChange} value={this.state.phone} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="occupation">Выберите Должность:</label>
                    <select className="form-control" value={this.state.occupation} name="occupation" onChange={this.onChange} required>
                      {occupationOptions.map((item, index) =>
                        <option key={index} value={item.value}>{item.label}</option>
                      )}
                    </select>
                  </div>

                  {this.state.occupation === 'disinfector' || this.state.occupation === 'subadmin' ? (
                    <div className="form-group">
                      <label htmlFor="color">Выберите Цвет (для календаря):</label>
                      <select className="form-control" value={this.state.color} name="color" onChange={this.onChange} required>
                        {colorOptions.map((item, index) =>
                          <option key={index} value={item.value}>{item.label}</option>
                        )}
                      </select>
                    </div>
                  ) : ''}

                  <div className="form-group">
                    <label htmlFor="birthday">Дата Рождения:</label>
                    <input type="date" name="birthday" className="form-control" onChange={this.onChange} defaultValue={this.state.birthday} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="married">Выберите социальный статус:</label>
                    <select className="form-control" value={this.state.married} name="married" onChange={this.onChange} required>
                      <option value="">--Выберите здесь -- </option>
                      <option value="yes">Женат / Замужем</option>
                      <option value="no"> Не женат / Не замужем</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="hasChildren">Есть ли дети у пользователя?</label>
                    <select className="form-control" value={this.state.hasChildren} name="hasChildren" onChange={this.onChange} required>
                      <option value="">--Выберите здесь -- </option>
                      <option value="yes">Есть</option>
                      <option value="no"> Нет</option>
                    </select>
                  </div>
                  {this.state.hasChildren === 'yes' ? (
                    <div className="form-group">
                      <label htmlFor="children">Сколько детей?</label>
                      <input type="number" name="children" step="1" min="1" className="form-control" onChange={this.onChange} value={this.state.children} required />
                    </div>
                  ) : ''}
                  <button type="submit" className="btn btn-primary">Редактировать</button>
                </form>
              </div>
            </div>
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

export default connect(mapStateToProps, { getUserById, editUser })(withRouter(EditUser));