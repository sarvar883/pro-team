import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';

import TextFieldGroup from '../common/TextFieldGroup';
import { searchClients } from '../../actions/adminActions';

class ClientList extends Component {
  state = {
    name: '',
    phone: '',
    address: '',
    inn: '',
    method: '',
    headingText: '',
    clients: []
  };

  componentDidMount() {
    if (this.props.admin.clients.length > 0) {
      this.setState({
        clients: this.props.admin.clients,
        method: this.props.admin.searchClientsMethod,
        headingText: this.props.admin.searchClientsInput
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      clients: nextProps.admin.clients
    });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  searchByName = (e) => {
    e.preventDefault();
    this.setState({
      method: 'name',
      headingText: this.state.name
    });
    const object = {
      method: 'name',
      payload: this.state.name
    };
    this.props.searchClients(object);
  }

  searchByPhone = (e) => {
    e.preventDefault();
    this.setState({
      method: 'phone',
      headingText: this.state.phone
    });
    const object = {
      method: 'phone',
      payload: this.state.phone
    };
    this.props.searchClients(object);
  }

  searchByAddress = (e) => {
    e.preventDefault();
    this.setState({
      method: 'address',
      headingText: this.state.address
    });
    const object = {
      method: 'address',
      payload: this.state.address
    };
    this.props.searchClients(object);
  }

  searchByInn = (e) => {
    e.preventDefault();
    this.setState({
      method: 'inn',
      headingText: this.state.inn
    });
    const object = {
      method: 'inn',
      payload: this.state.inn
    };
    this.props.searchClients(object);
  };

  searchAll = (e) => {
    e.preventDefault();
    this.setState({
      method: 'all'
    });
    const object = {
      method: 'all',
      payload: ''
    };
    this.props.searchClients(object);
  }

  showCorporate = () => {
    this.setState({
      method: 'corporate',
      headingText: 'Корпоративный'
    });
    const object = {
      method: 'corporate',
      payload: 'Корпоративный'
    };
    this.props.searchClients(object);
  };

  render() {
    // sort clients alphabetically
    let clients = this.state.clients.sort((a, b) => {
      if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
      if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
      return 0;
    });

    let renderClients = clients.map((client, index) =>
      <tr key={index}>
        <td>{client.name} {client.type === 'corporate' && client.inn ? `(ИНН: ${client.inn})` : ''}</td>
        <td><Link to={`/client/${client._id}`} className="btn btn-primary pl-1 pr-1"><i className="fas fa-comment-dots"></i> Подробнее</Link></td>
        <td>{client.type === 'corporate' ? 'Корп.' : 'Физ.'}</td>
        <td>{client.phone ? client.phone : '--'}</td>
        <td>{client.address ? client.address : '--'}</td>
      </tr>
    );

    let wordInHeading = '';
    switch (this.state.method) {
      case 'name': wordInHeading = 'по имени'; break;

      case 'phone': wordInHeading = 'по номеру телефона'; break;

      case 'address': wordInHeading = 'по адресу'; break;

      case 'inn': wordInHeading = 'по ИНН'; break;

      case 'corporate': wordInHeading = 'по роли'; break;

      default: wordInHeading = '';
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center">Поиск клиентов</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4 col-md-6 mt-2">
            <form onSubmit={this.searchByName} className="form-bg p-1">
              <h4 className="text-center mb-0">Поиск по имени</h4>
              <TextFieldGroup
                type="text"
                placeholder="Имя"
                name="name"
                value={this.state.client}
                onChange={this.onChange}
                required
              />
              <button type="submit" className="btn btn-success"><i className="fas fa-search"></i> Искать</button>
            </form>
          </div>

          <div className="col-lg-4 col-md-6 mt-2">
            <form onSubmit={this.searchByPhone} className="form-bg p-1">
              <h4 className="text-center mb-0">Поиск по номеру телефона</h4>
              <TextFieldGroup
                type="text"
                placeholder="Номер телефона"
                name="phone"
                value={this.state.phone}
                onChange={this.onChange}
                required
              />
              <button type="submit" className="btn btn-primary"><i className="fas fa-search"></i> Искать</button>
            </form>
          </div>

          <div className="col-lg-4 col-md-6 mt-2">
            <form onSubmit={this.searchByAddress} className="form-bg p-1">
              <h4 className="text-center mb-0">Поиск по адресу</h4>
              <TextFieldGroup
                type="text"
                placeholder="Адрес"
                name="address"
                value={this.state.address}
                onChange={this.onChange}
                required
              />
              <button type="submit" className="btn btn-dark"><i className="fas fa-search"></i> Искать</button>
            </form>
          </div>

          <div className="col-lg-4 col-md-6 mt-2">
            <form onSubmit={this.searchByInn} className="form-bg p-1">
              <h4 className="text-center mb-0">Поиск по ИНН</h4>
              <TextFieldGroup
                type="text"
                placeholder="ИНН"
                name="inn"
                value={this.state.inn}
                onChange={this.onChange}
                required
              />
              <button type="submit" className="btn btn-warning"><i className="fas fa-search"></i> Искать</button>
            </form>
          </div>

          <div className="col-lg-4 col-md-6 mt-2">
            <button type="submit" className="btn btn-danger" onClick={() => this.showCorporate()}><i className="fas fa-building"></i> Корпоративные клиенты</button>
          </div>

          {/* <div className="col-lg-4 col-md-6 mt-3">
            <form onSubmit={this.searchAll}>
              <button type="submit" className="btn btn-info">Посмотреть все клиенты</button>
            </form>
          </div> */}
        </div>

        <div className="row mt-3">
          <div className="col-12">
            {/* {this.state.method === 'name' ? <h2 className="text-center">Результаты поиска клиентов по имени "{this.state.headingText}"</h2> : ''}

            {this.state.method === 'phone' ? <h2 className="text-center">Результаты поиска клиентов по номеру телефона "{this.state.headingText}"</h2> : ''}

            {this.state.method === 'address' ? <h2 className="text-center">Результаты поиска клиентов по адресу "{this.state.headingText}"</h2> : ''} */}

            {this.state.method !== '' && (
              <React.Fragment>
                {this.state.method === 'all' ?
                  <h2 className="text-center">Все клиенты</h2> :
                  <h2 className="text-center">Результаты поиска клиентов {wordInHeading} "{this.state.headingText}"</h2>
                }
              </React.Fragment>
            )}
          </div>
        </div>

        {this.props.admin.loadingClients ? (
          <div className="row mt-3">
            <div className="col-12">
              <Spinner />
            </div>
          </div>
        ) : (
          <React.Fragment>
            {this.state.method !== '' && clients.length === 0 ? (
              <div className="row">
                <div className="col-12">
                  <h2 className="text-center">Клиенты не найдены</h2>
                </div>
              </div>
            ) : (
              <div className="row">
                {clients.length > 0 &&
                  <div className="col-12">
                    <h4>Найдено клиентов: {clients.length}</h4>
                  </div>
                }

                <div className="col-12">
                  <div className="table-responsive mt-3">
                    <table className="table table-bordered table-hover table-striped">
                      <thead>
                        <tr>
                          <th>Имя</th>
                          <th>Подробнее</th>
                          <th>Тип</th>
                          <th>Телефон</th>
                          <th>Адрес</th>
                        </tr>
                      </thead>
                      <tbody>
                        {renderClients}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
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

export default connect(mapStateToProps, { searchClients })(withRouter(ClientList));