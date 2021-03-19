import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';

import { clientById, editClient } from '../../actions/adminActions';

class EditClient extends Component {
  state = {
    client: {
      orders: [],
    },
    id: '',
    type: '',
    name: '',
    phone: '',
    address: '',
    inn: ''
  };

  componentDidMount() {
    if (this.props.admin.clientById._id) {
      this.setState({
        client: this.props.admin.clientById,
        id: this.props.admin.clientById._id,
        type: this.props.admin.clientById.type,
        name: this.props.admin.clientById.name || '',
        phone: this.props.admin.clientById.phone || '',
        address: this.props.admin.clientById.address || '',
        inn: this.props.admin.clientById.inn || ''
      });
    } else {
      this.props.clientById(this.props.match.params.id);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.admin.clientById) {
      this.setState({
        client: nextProps.admin.clientById,
        id: nextProps.admin.clientById._id,
        type: nextProps.admin.clientById.type,
        name: nextProps.admin.clientById.name || '',
        phone: nextProps.admin.clientById.phone || '',
        address: nextProps.admin.clientById.address || '',
        inn: nextProps.admin.clientById.inn || ''
      });
    }
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();
    const object = {
      id: this.state.id,
      type: this.state.type,
      name: this.state.name,
      phone: this.state.phone,
      address: this.state.address,
      inn: this.state.inn
    };
    this.props.editClient(object, this.props.history);
  };

  render() {
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
              <div className="row mt-3">
                <div className="col-lg-6 col-md-8 m-auto">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="display-5 text-center">Редактировать Клиента</h3>
                      <p className="font-bold mb-0">Тип клиента: {this.state.type === 'corporate' ? 'Корпоративный' : 'Физический'}</p>

                      <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                          <label htmlFor="name">Имя Клиента:</label>
                          <input type="text" name="name" className="form-control" onChange={this.onChange} value={this.state.name} required />
                        </div>

                        {this.state.type === 'individual' && (
                          <React.Fragment>
                            <div className="form-group">
                              <label htmlFor="phone">Телефон Клиента:</label>
                              <input type="text" name="phone" className="form-control" onChange={this.onChange} value={this.state.phone} required />
                            </div>
                            <div className="form-group">
                              <label htmlFor="address">Адрес Клиента:</label>
                              <input type="text" name="address" className="form-control" onChange={this.onChange} value={this.state.address} required />
                            </div>
                          </React.Fragment>
                        )}

                        {this.state.type === 'corporate' && (
                          <div className="form-group">
                            <label htmlFor="inn">ИНН Клиента:</label>
                            <input type="text" name="inn" className="form-control" onChange={this.onChange} value={this.state.inn} />
                          </div>
                        )}
                        <button type="submit" className="btn btn-primary">Редактировать</button>
                      </form>
                    </div>
                  </div>
                </div>
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

export default connect(mapStateToProps, { clientById, editClient })(withRouter(EditClient));