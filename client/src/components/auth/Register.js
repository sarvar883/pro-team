import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';
import SelectListGroup from '../common/SelectListGroup';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      phone: '',
      occupation: '',
      color: '',
      password: '',
      password2: '',
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      occupation: this.state.occupation,
      color: this.state.color,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const { errors } = this.state;

    // user occupation options
    const occupationOptions = [
      { label: '-- Выберите должность пользователя --', value: 0 },
      { label: 'Админ', value: 'admin' },
      { label: 'Субадмин', value: 'subadmin' },
      { label: 'Оператор', value: 'operator' },
      { label: 'Дезинфектор', value: 'disinfector' },
      // { label: 'Маркетолог', value: 'marketer' },
      { label: 'Бухгалтер', value: 'accountant' }
    ];

    const colorOptions = [
      { label: '-- Выберите цвет пользователя (для календаря) --', value: 0 },
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

    return (
      <div className="container register mt-4">
        <div className="row">
          <div className="col-md-8 m-auto">
            <div className="card">
              <div className="card-body">
                <h2 className="text-center">Создать Аккаунт</h2>
                <form noValidate onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    label="Введите Имя"
                    type="text"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange}
                    error={errors.name}
                  />
                  <TextFieldGroup
                    label="Введите E-mail"
                    name="email"
                    type="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.email}
                  />
                  <TextFieldGroup
                    label="Введите номер телефона"
                    type="phone"
                    name="phone"
                    value={this.state.phone}
                    onChange={this.onChange}
                    error={errors.phone}
                  />
                  <SelectListGroup
                    name="occupation"
                    value={this.state.occupation}
                    onChange={this.onChange}
                    error={errors.occupation}
                    options={occupationOptions}
                  />
                  {this.state.occupation === 'disinfector' ||
                    this.state.occupation === 'subadmin' ? (
                      <SelectListGroup
                        name="color"
                        value={this.state.color}
                        onChange={this.onChange}
                        error={errors.color}
                        options={colorOptions}
                      />
                    ) : ''}
                  <TextFieldGroup
                    label="Введите Пароль"
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    error={errors.password}
                  />
                  <TextFieldGroup
                    label="Повторите Пароль"
                    type="password"
                    name="password2"
                    value={this.state.password2}
                    onChange={this.onChange}
                    error={errors.password2}
                  />
                  <button type="submit" className="btn btn-success btn-block mt-4" >Создать</button>
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
  errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));