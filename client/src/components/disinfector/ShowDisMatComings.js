import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import materials from '../common/materials';
import removeZeros from '../../utils/removeZerosMat';

class ShowDisMatComings extends Component {
  state = {
    comings: this.props.disinfector.matComing
  };

  render() {
    const { comings } = this.state;
    let totalMatComing = [];

    materials.forEach(item => {
      totalMatComing.push({
        material: item.material,
        amount: 0,
        unit: item.unit
      });
    });

    comings.forEach(thing => {
      thing.materials.forEach(item => {
        totalMatComing.forEach(element => {
          if (item.material === element.material && item.unit === element.unit) {
            element.amount += item.amount;
          }
        });
      });
    });

    // remove materials with amount of 0
    totalMatComing = removeZeros(totalMatComing);

    let renderTotal = totalMatComing.map((item, index) =>
      <li key={index}>{item.material}: {item.amount.toLocaleString()} {item.unit}</li>
    );

    let renderComings = comings.map((item, index) => {
      let renderMaterials = item.materials.map((element, number) =>
        <li key={number}>{element.material}: {element.amount.toLocaleString()} {element.unit}</li>
      );

      return (
        <div className="col-lg-4 col-md-6" key={index}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 list-unstyled">
                <li>Кто Вам Раздал: {item.admin.occupation} {item.admin.name}</li>
                <li>Материалы:</li>
                <ul>
                  {renderMaterials}
                </ul>
                <li className="mt-1">Дата: <Moment format="DD/MM/YYYY HH:mm">{item.createdAt}</Moment></li>
              </ul>
            </div>
          </div>
        </div>
      );
    });

    return (
      <React.Fragment>

        <div className="row">
          <div className="col-lg-5 col-md-7 m-auto">
            <div className="card order mt-2">
              <div className="card-body p-0">
                <h4 className="text-center">Общий Приход Материалов за этот период:</h4>
                <ul className="font-bold mb-0 list-unstyled">
                  {renderTotal}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          {renderComings}
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
  disinfector: state.disinfector,
  subadmin: state.subadmin,
  errors: state.errors
});

export default connect(mapStateToProps, {})(withRouter(ShowDisMatComings));