import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import guaranteeExpired from '../../utils/guaranteeExpired';
import orderFullyProcessed from '../../utils/orderFullyProcessed';


class ClientNotSatisfiedButton extends Component {
  state = {
    // роли, которые могут видеть кнопку "Клиент недоволен"
    possibleOccupations: ['admin', 'accountant', 'subadmin', 'operator'],
    // occupation of logged in user
    userOccupation: this.props.auth.user.occupation,

    // passed-in props
    order: this.props.order,
    shouldLoadOrder: this.props.shouldLoadOrder,

    // if forceToShow === true, this button is displayed no matter what
    // forceToShow: this.props.forceToShow,

    // !!!
    // if forceToShow === true, then it is recommended, that shouldLoadOrder is also true
    // because we do not know in what component this button is clicked
    // and if fields are populated
    // !!!
  };

  goToAddNewForm = () => {
    this.props.history.push(`/fail/add-new/${this.state.order._id}`, {
      pathname: `/fail/add-new/${this.state.order._id}`,
      state: {
        order: this.state.order,
        shouldLoadOrder: this.state.shouldLoadOrder
      }
    });
  };


  render() {
    // console.log('ClientNedovolen', this.state);
    // console.log('ClientNedovolen order', this.state.order);

    const { userOccupation, order } = this.state;

    let shouldShowButton = false;

    // если заказ некачественный и срок гарантии не истек
    let generalRule = false;

    if (
      this.state.possibleOccupations.includes(userOccupation) &&
      order.completed &&
      // order.failed && 
      order.guarantee && !guaranteeExpired(order.completedAt, order.guarantee)
    ) {
      generalRule = true;
    }


    if (
      order.completed &&
      (generalRule || !orderFullyProcessed(order)) &&
      !order.prevFailedOrder
    ) {
      shouldShowButton = true;
    } else {
      shouldShowButton = false;
    }

    return (
      <React.Fragment>
        {shouldShowButton ? (
          <button
            className="btn btn-secondary mt-3 mr-2"
            onClick={() => this.goToAddNewForm()}
          >
            Клиент Недоволен
          </button>
        ) : ''}
      </React.Fragment>
    );
  }
}

ClientNotSatisfiedButton.defaultProps = {
  order: {},
  shouldLoadOrder: true,
  // forceToShow: false
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps)(withRouter(ClientNotSatisfiedButton));