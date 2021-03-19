import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import materials from '../common/materials';
import removeZeros from '../../utils/removeZerosMat';

class ShowAddMatEvents extends Component {
  state = {
    events: this.props.admin.addMatEvents
  };

  render() {
    const { events } = this.state;
    const { disinfectors } = this.props.admin;

    let totalAddedMat = [];

    materials.forEach(item => {
      totalAddedMat.push({
        material: item.material,
        amount: 0,
        unit: item.unit
      });
    });

    let disinfArray = [];
    disinfectors.forEach(person => disinfArray.push({
      _id: person._id,
      name: person.name,
      occupation: person.occupation,
      events: [],
      received: materials.map(item => {
        return {
          material: item.material,
          amount: 0,
          unit: item.unit
        }
      })
    }));

    totalAddedMat.forEach(item => {
      events.forEach(event => {
        event.materials.forEach(material => {
          if (material.material === item.material && material.unit === item.unit) {
            item.amount += material.amount;
          }
        });
      });
    });

    events.forEach(event => {
      disinfArray.forEach(element => {

        if (event.disinfector && event.disinfector._id.toString() === element._id.toString() && event.disinfector.name === element.name) {
          element.events.push(event);
          element.received.forEach(i => {
            event.materials.forEach(thing => {
              if (thing.material === i.material && thing.unit === i.unit) {
                i.amount += thing.amount;
                return;
              }
            });
          });
        }
      });
    });

    // remove materials with amount of 0
    totalAddedMat = removeZeros(totalAddedMat);

    let renderTotal = totalAddedMat.map((item, index) =>
      <li key={index}>{item.material}: {item.amount.toLocaleString()} {item.unit}</li>
    );

    let renderDisinfectors = disinfArray.map((person, index) => {
      // remove materials with amount of 0
      person.received = removeZeros(person.received);

      let renderDisinfectorTotal = person.received.map((item, number) =>
        <li key={number}>{item.material}: {item.amount.toLocaleString()} {item.unit}</li>
      );

      let renderDisinfEvents = person.events.map((event, iteration) => {

        let renderEventsInDisinfArray = event.materials.map((item, number) =>
          <li key={number}>{item.material}: {item.amount.toLocaleString()} {item.unit}</li>
        );

        return (
          <React.Fragment key={iteration}>
            <div className="col-lg-4 col-md-6" key={iteration}>
              <div className="card order mt-2">
                <div className="card-body p-0">
                  <ul className="font-bold mb-0 list-unstyled">
                    <li>Когда Получено: <Moment format="DD/MM/YYYY HH:mm">{event.createdAt}</Moment></li>
                    <li>Кто раздал: {event.admin.occupation} {event.admin.name}</li>
                    <p className="mb-0">Материалы</p>
                    <ul>
                      {renderEventsInDisinfArray}
                    </ul>
                  </ul>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      });

      return (
        <React.Fragment key={index}>
          <div className="border-between-disinfectors mt-3"></div>
          <div className="border-between-disinfectors mt-1"></div>
          <h3 className="text-center mt-3">{person.occupation} {person.name}</h3>

          {person.events.length === 0 ? (
            <h4>У пользователя нет раздач</h4>
          ) : (
            <React.Fragment>
              <div className="row mt-3">
                <div className="col-lg-4 col-md-6">
                  <div className="card order mt-2">
                    <div className="card-body p-0">
                      <h4 className="text-center">Всего {person.name} Получил за этот период:</h4>
                      <ul className="font-bold mb-0 list-unstyled">
                        {renderDisinfectorTotal}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                {renderDisinfEvents}
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      );
    });

    return (
      <React.Fragment>

        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <h4 className="text-center">Общая Раздача Материалов за этот период:</h4>
                <ul className="font-bold mb-0 list-unstyled">
                  {renderTotal}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-12">
            <h2 className="text-center pl-3 pr-3">Раздача Материалов Пользователям</h2>
            {renderDisinfectors}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  admin: state.admin,
  errors: state.errors
});

export default connect(mapStateToProps)(withRouter(ShowAddMatEvents));