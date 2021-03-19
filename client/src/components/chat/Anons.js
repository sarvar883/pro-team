import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';

import { getAllAnons, addAnons } from '../../actions/chatActions';

import ShowAnons from './ShowAnons';

class Anons extends Component {
  state = {
    anons: ''
  };

  componentDidMount() {
    this.props.getAllAnons();
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  createAd = (e) => {
    e.preventDefault();
    const object = {
      adminId: this.props.auth.user.id,
      body: this.state.anons
    };
    this.props.addAnons(object, this.props.history);
    this.setState({ anons: '' });
    document.getElementById('close-modal').click();
  };

  render() {
    const { loadingAnons } = this.props.chat;
    return (
      <React.Fragment>
        {this.props.auth.user.occupation === 'admin' ? (
          <div className="container mt-2">
            <div className="row m-0">
              <div className="ads">
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#createAnons">Создать Объявление</button>
                <div className="modal fade" id="createAnons">
                  <div className="modal-dialog">
                    <div className="modal-content">

                      <div className="modal-header">
                        <h4 className="modal-title">Создать Объявление</h4>
                        <button type="button" className="close" id="close-modal" data-dismiss="modal">&times;</button>
                      </div>

                      <form onSubmit={this.createAd}>
                        <div className="modal-body">
                          <div className="form-group">
                            <textarea
                              className="form-control"
                              rows="5"
                              name="anons"
                              defaultValue={this.state.anons}
                              placeholder="Пишите Ваше Объявление ..."
                              required
                              onChange={this.onChange}
                            />
                          </div>
                        </div>

                        <div className="modal-footer">
                          <button type="submit" className="btn btn-success">Создать</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : ''}

        <div className="container">
          {loadingAnons ? <Spinner /> : (
            <ShowAnons />
          )}
        </div>
      </React.Fragment>
    )
  }
}

Anons.propTypes = {
  getAllAnons: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  chat: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  chat: state.chat,
  errors: state.errors
});

export default connect(mapStateToProps, { getAllAnons, addAnons })(withRouter(Anons));