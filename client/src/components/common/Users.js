import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';

import { getAllUsers } from '../../actions/orderActions';
import {
  changePassword,
  disableUser,
  setUserById
} from '../../actions/adminActions';

class Users extends Component {
  state = {
    users: [],
    userId: '',
    password1: '',
    password2: ''
  };

  // componentDidMount() {
  //   if (this.props.admin.users && this.props.admin.users.length > 0) {
  //     this.setState({
  //       users: this.props.admin.users
  //     });
  //   } else {
  //     this.props.getAllUsers();
  //   }
  // }

  componentDidMount() {
    this.props.getAllUsers();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.admin.users) {
      this.setState({
        users: nextProps.admin.users
      });
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  clearState = (e) => {
    this.setState({
      userId: '',
      password1: '',
      password2: ''
    });
  };

  changePassword = (e) => {
    e.preventDefault();
    let notMatch = false, invalidLength = false;

    if (this.state.password1 !== this.state.password2) {
      notMatch = true;
    }
    if (this.state.password1.length < 6 || this.state.password1.length > 30) {
      invalidLength = true;
    }
    if (this.state.password2.length < 6 || this.state.password2.length > 30) {
      invalidLength = true;
    }

    if (notMatch) {
      alert('Пароли не совпадают');
    } else if (invalidLength) {
      alert('Длина пароля должна быть не менее 6 символов и не более 30 символов');
    } else {
      const object = {
        userId: this.state.userId,
        password1: this.state.password1,
        password2: this.state.password2
      };
      this.props.changePassword(object, this.props.history);
      window.location.reload();
    }
  };

  deleteUser = (id) => {
    const object = {
      id: id
    };

    this.props.disableUser(object, this.props.history);
  };

  changeMaterials = (user) => {
    this.props.setUserById(user);
    this.props.history.push(`/admin/set-disinfector-materials/${user._id}`);
  };

  render() {
    let userOptions = [{
      label: '- Выберите Пользователя -- ', value: ''
    }];

    let renderUsers = this.state.users.map((user, key) => {
      userOptions.push({
        label: `${user.occupation} ${user.name}`, value: user._id
      });

      return (
        <div className="col-lg-4 col-md-6 mt-3" key={key}>
          <div className="card order">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 pl-0 list-unstyled">
                <li>Имя: {user.name}</li>
                <li>E-mail: {user.email}</li>
                <li>Телефон: {user.phone}</li>
                <li>Должность: {user.occupation}</li>
                <li>Цвет (в календаре): {user.color || '--'}</li>
              </ul>

              <Link
                to={`/admin/edit-user/${user._id}`}
                className="btn btn-dark mt-2 mr-2"
              >
                <i className="fas fa-user-edit"></i> Редактировать
              </Link>

              {['subadmin', 'disinfector'].includes(user.occupation) && (
                <button
                  className="btn btn-primary mt-2 mr-2"
                  onClick={() => this.changeMaterials(user)}
                >
                  <i className="fas fa-syringe"></i> Изменить материалы
                </button>
              )}

              <button
                className="btn btn-danger mt-2 mr-2"
                onClick={() => {
                  if (window.confirm(`Вы уверены удалить пользователя ${user.occupation} ${user.name}?`)) {
                    this.deleteUser(user._id)
                  }
                }}
              >
                <i className="fas fa-trash-alt"></i> Удалить
              </button>

            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center">Все Пользователи</h2>
          </div>
        </div>

        {this.props.admin.loadingUsers ? <Spinner /> : (
          <React.Fragment>

            <div className="row mt-1">
              <div className="col-12">
                <button type="button" className="btn btn-primary mt-2" data-toggle="modal" data-target='#changePassword'><i className="fas fa-key"></i> Изменить пароль Пользователя</button>

                <div className="modal fade" id='changePassword'>
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="close" onClick={this.clearState.bind(this)} data-dismiss="modal">&times;</button>
                      </div>

                      <div className="modal-body">
                        <h4 className="modal-title"><i className="fas fa-key"></i> Изменить Пароль Пользователя</h4>
                        <form onSubmit={this.changePassword}>
                          <div className="form-group">
                            <select className="form-control" name="userId" onChange={this.onChange} value={this.state.userId} required>
                              {userOptions.map((user, key) =>
                                <option key={key} value={user.value}>{user.label}</option>
                              )}
                            </select>
                          </div>
                          <div className="form-group">
                            <label htmlFor="password1">Введите Новый Пароль:</label>
                            <input type="password" name="password1" className="form-control" onChange={this.onChange} value={this.state.password1} required />
                          </div>
                          <div className="form-group">
                            <label htmlFor="password2">Повторите Пароль:</label>
                            <input type="password" name="password2" className="form-control" onChange={this.onChange} value={this.state.password2} required />
                          </div>
                          <button type="submit" className="btn btn-success"><i className="fas fa-copyright"></i> Изменить Пароль</button>
                        </form>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-2">
              {renderUsers}
            </div>

          </React.Fragment>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
  errors: state.errors
});

export default connect(mapStateToProps, { getAllUsers, changePassword, disableUser, setUserById })(withRouter(Users));