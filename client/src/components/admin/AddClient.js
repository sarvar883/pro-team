import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { addClient } from '../../actions/adminActions';

import TextFieldGroup from '../common/TextFieldGroup';
import SelectListGroup from '../common/SelectListGroup';

class AddClient extends Component {
  state = {
    type: '',
    name: '',
    phone: '',
    address: '',
    inn: '',
    errors: {}
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();

    if (!this.state.type) {
      alert('Выберите тип клиента');
    } else if (this.state.type === 'individual') {
      let numberCharacters = 0;
      for (let i = 1; i <= 12; i++) {
        if (this.state.phone[i] >= '0' && this.state.phone[i] <= '9') {
          numberCharacters++;
        }
      }

      if (this.state.phone.length !== 13) {
        alert('Телефонный номер должен содержать 13 символов. Введите в формате +998XXXXXXXXX');
      } else if (this.state.phone[0] !== '+') {
        alert('Телефонный номер должен начинаться с "+". Введите в формате +998XXXXXXXXX');
      } else if (numberCharacters !== 12) {
        alert('Телефонный номер должен содержать "+" и 12 цифр');
      } else {
        let object = {
          type: this.state.type,
          name: this.state.name,
          phone: this.state.phone,
          address: this.state.address,
          createdAt: new Date()
        };
        this.props.addClient(object, this.props.history, this.props.auth.user.occupation);
      }
    } else if (this.state.type === 'corporate') {
      let object = {
        type: this.state.type,
        name: this.state.name,
        inn: this.state.inn,
        createdAt: new Date()
      };
      this.props.addClient(object, this.props.history, this.props.auth.user.occupation);
    }
  }

  render() {
    const { errors } = this.state;

    const clientTypes = [
      { label: '-- Введите тип клиента --', value: '' },
      { label: 'Корпоративный', value: 'corporate' },
      { label: 'Физический', value: 'individual' }
    ];

    return (
      <div className="container create-order mt-4" >
        <div className="row">
          <div className="col-md-8 m-auto">
            <div className="card">
              <div className="card-body">
                <h3 className="text-center">Добавить Клиента</h3>
                <form onSubmit={this.onSubmit}>
                  <SelectListGroup
                    name="type"
                    value={this.state.type}
                    onChange={this.onChange}
                    error={errors.type}
                    options={clientTypes}
                    required
                  />
                  <TextFieldGroup
                    label="Введите Имя Клиента"
                    type="text"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange}
                    error={errors.name}
                    required
                  />

                  {this.state.type === 'corporate' ? (
                    <React.Fragment>
                      <TextFieldGroup
                        label="Введите ИНН Клиента"
                        type="text"
                        name="inn"
                        value={this.state.inn}
                        onChange={this.onChange}
                        error={errors.inn}
                      />
                    </React.Fragment>
                  ) : ''}

                  {this.state.type === 'individual' ? (
                    <React.Fragment>
                      <TextFieldGroup
                        label="Введите Тел Номер Клиента в формате +998XX-XXX-XX-XX (без тире)"
                        type="text"
                        name="phone"
                        value={this.state.phone}
                        onChange={this.onChange}
                        error={errors.phone}
                        required
                      />
                      <TextFieldGroup
                        label="Введите Адрес Клиента"
                        type="text"
                        name="address"
                        value={this.state.address}
                        onChange={this.onChange}
                        error={errors.address}
                        required
                      />
                    </React.Fragment>
                  ) : ''}
                  <button type="submit" className="btn btn-success">Добавить</button>
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

export default connect(mapStateToProps, { addClient })(withRouter(AddClient));