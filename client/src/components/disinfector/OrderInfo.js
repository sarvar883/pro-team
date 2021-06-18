import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Moment from 'react-moment';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';

import { getOrders, addDisinfectorComment, deleteOrder } from '../../actions/orderActions';


class OrderInfo extends Component {
  state = {
    addComment: false,
    disinfectorComment: this.props.orderObject.disinfectorComment,
    errors: {}
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  toggleAddComment = (e) => {
    e.preventDefault();
    this.setState({
      addComment: !this.state.addComment
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const object = {
      id: this.props.orderObject._id,
      comment: this.state.disinfectorComment
    };
    this.props.addDisinfectorComment(object, this.props.history, this.props.auth.user.occupation);
    this.setState({
      addComment: !this.state.addComment
    })
  };

  // delete = (order) => {
  //   const object = {
  //     id: order._id,
  //     clientType: order.clientType,
  //     clientPhone: order.phone,
  //     clientId: order.clientType === 'corporate' ? order.clientId._id : '',
  //     orderDateFrom: order.dateFrom
  //   };
  //   console.log(object);
  //   this.props.deleteOrder(object, this.props.history, this.props.auth.user.occupation);
  // };

  render() {
    const { orderObject } = this.props;
    const { errors } = this.state;

    let currentTime = new Date();

    return (
      <div className="col-lg-4 col-md-6 mt-3">
        <div className="card order">
          <div className="card-body p-0">
            <ul className="font-bold list-unstyled">
              {orderObject.prevFailedOrder && <h3><i className="fas fas fa-exclamation"></i> Повторный заказ <i className="fas fas fa-exclamation"></i></h3>}

              {/* {orderObject.disinfectorId && (
                <li>Дезинфектор: {orderObject.disinfectorId.name}</li>
              )} */}

              {orderObject.clientType === 'corporate' ?
                <React.Fragment>
                  {orderObject.clientId ? (
                    <li className="text-danger">Корпоративный Клиент: {orderObject.clientId.name}</li>
                  ) : <li className="text-danger">Корпоративный Клиент</li>}
                  <li className="text-danger">Имя клиента: {orderObject.client}</li>
                </React.Fragment>
                : ''}
              {orderObject.clientType === 'individual' ?
                <li className="text-danger">Физический Клиент: {orderObject.client}</li> : ''
              }
              <li className="text-danger">Тел. номер клиента: {orderObject.phone}</li>
              {orderObject.phone2 !== '' ? (<li className="text-danger">Запасной номер: {orderObject.phone2}</li>) : ''}


              <li className="text-danger">Дата и Время выполнения: <Moment format="DD/MM/YYYY HH:mm">{orderObject.dateFrom}</Moment></li>


              <li className="text-danger">Адрес: {orderObject.address}</li>


              <li className="text-danger">Тип услуги: {orderObject.typeOfService}</li>

              <li>Комментарии Оператора: {orderObject.comment ? orderObject.comment : '--'}</li>
              <li>Комментарии Дезинфектора: {this.state.disinfectorComment ? this.state.disinfectorComment : '--'}</li>

              {orderObject.userAcceptedOrder ? (
                <li>Заказ принял: {orderObject.userAcceptedOrder.occupation} {orderObject.userAcceptedOrder.name}</li>
              ) : ''}

              {orderObject.userCreated ? (
                <li>Заказ Добавлен: {orderObject.userCreated.occupation} {orderObject.userCreated.name} <Moment format="DD/MM/YYYY HH:mm">{orderObject.createdAt}</Moment></li>
              ) : ''}
            </ul>

            {this.state.addComment ? (
              <form onSubmit={this.onSubmit}>
                <TextAreaFieldGroup
                  name="disinfectorComment"
                  placeholder="Ваш комментарий"
                  value={this.state.disinfectorComment}
                  onChange={this.onChange}
                  error={errors.disinfectorComment}
                />
                <div className="btn-group">
                  <button type="submit" className="btn btn-success mr-3"><i className="fas fa-plus-circle"></i> Добавить</button>
                  <button type="button" className="btn btn-warning" onClick={this.toggleAddComment}><i className="fas fa-window-close"></i> Закрыть</button>
                </div>
              </form>
            ) : (
              <button type="button" className="btn btn-success d-block" onClick={this.toggleAddComment}><i className="fas fa-comment-dots"></i> Добавить Комментарий</button>
            )}

            {currentTime.getTime() > new Date(orderObject.dateFrom).getTime() ? (
              <Link
                to={`/order-complete-form/${orderObject._id}`}
                className="btn btn-primary mt-3"
              >
                <i className="fas fa-file-alt"></i> Форма О Выполнении
              </Link>
            ) : ''}

            {/* <button className="btn btn-danger mt-3 ml-3" onClick={() => this.delete(orderObject)}>Delete</button> */}

          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  order: state.order,
  errors: state.errors
});

export default connect(mapStateToProps, { getOrders, addDisinfectorComment, deleteOrder })(withRouter(OrderInfo));