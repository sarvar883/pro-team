import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from './Spinner';

import materials from './materials';
import removeZeros from '../../utils/removeZerosMat';

import {
  getUserById,
  setDisinfectorMaterials,
} from '../../actions/adminActions';


class SetDisinfectorMaterials extends Component {
  state = {
    user: {
      materials: []
    },

    materials: [{
      material: '',
      amount: 0,
      unit: ''
    }]
  };

  componentDidMount() {
    if (
      this.props.admin.userById &&
      this.props.admin.userById._id &&
      this.props.admin.userById.materials
    ) {
      this.setState({
        user: this.props.admin.userById
      });
    } else {
      this.props.getUserById(this.props.match.params.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.admin.userById) {
      this.setState({
        user: nextProps.admin.userById
      });
    }
  }


  changeSelect = (e) => {
    const index = e.target.name.split('-')[1];
    const value = e.target.value.split('+')[0];
    const unit = e.target.value.split('+')[1];

    let helpArray = [...this.state.materials];

    helpArray[index].material = value;
    helpArray[index].unit = unit;

    this.setState({
      materials: helpArray
    });
  }

  changeAmount = (e) => {
    const index = e.target.name.split('-')[1];
    const amount = Number(e.target.value);

    let helpArray = [...this.state.materials];
    helpArray[index].amount = amount;

    this.setState({
      materials: helpArray
    });
  }

  addMaterial = (e) => {
    e.preventDefault();

    const newMaterialObject = {
      material: '',
      amount: 0,
      unit: ''
    };

    let array = [...this.state.materials];
    array.push(newMaterialObject);
    this.setState({
      materials: array
    });
  }

  deleteMaterial = (e) => {
    e.preventDefault();

    // delete the last element in this.state.materials
    let array = [...this.state.materials];
    array.pop();

    this.setState({
      materials: array
    });
  }

  onSubmit = (e) => {
    e.preventDefault();

    console.clear();

    let hasEmptyFields = false;
    let hasNegativeAmountFields = false;

    // check for empty material name fields
    this.state.materials.forEach(item => {
      if (item.material === '' || item.unit === '') {
        hasEmptyFields = true;
      }

      if (item.amount < 0) {
        hasNegativeAmountFields = true;
      }
    });

    if (hasEmptyFields) {
      return alert('Заполните Поле "Выберите Материал и Количество"');
    }
    if (hasNegativeAmountFields) {
      return alert('Количество Материала не может быть отрицательнам числом');
    }

    const object = {
      userId: this.state.user._id,
      materials: this.state.materials
    };

    // console.log('object', object);
    this.props.setDisinfectorMaterials(object, this.props.history);
  }


  render() {
    const currentUser = this.state.user;

    const userMaterials = removeZeros(currentUser.materials || []);

    const materialLabels = [
      { label: '-- Выберите вещество --', value: "", unit: "" }
    ];

    materials.forEach(item => {
      materialLabels.push({
        label: item.material,
        value: item.material,
        unit: item.unit
      });
    });

    const materialOptions = materialLabels.map((option, index) =>
      <option value={`${option.value}+${option.unit}`} key={index}>{option.label} {option.unit}</option>
    );

    const renderMaterialInputs = this.state.materials.map((item, index) => {
      return (
        <React.Fragment key={index}>
          <div className="form-group">
            <select
              name={`material-${index}`}
              className="form-control"
              onChange={this.changeSelect}
              required
            >
              {materialOptions}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor={`quantity-${index}`}>Количество:</label>
            <input
              type="number"
              step="0.001"
              className="form-control"
              name={`quantity-${index}`}
              onChange={this.changeAmount}
              required
            />
          </div>
          <div className="border-bottom-red"></div>
        </React.Fragment>
      );
    });

    return (
      <div className="container-fluid">
        <div className="row mt-2">
          <div className="col-12">
            <h3 className="text-center">Изменить материалы пользователя</h3>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-6">
            {!currentUser._id || !currentUser.materials ? <Spinner /> : (
              <div className="card order">
                <div className="card-body p-0">
                  <ul className="font-bold mb-0 pl-0 list-unstyled">
                    <h4 className="text-center">{currentUser.occupation} {currentUser.name}</h4>
                    <p className="mb-0">Имеется в наличии материалов:</p>
                    <ul>
                      {userMaterials.map((material, number) =>
                        <li key={number}>{material.material}: {material.amount} {material.unit}</li>)}
                    </ul>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="col-md-6">
            <div className="card mt-2">
              <div className="card-body">
                <h4 className="text-center">Введите Материалы</h4>
                <form onSubmit={this.onSubmit}>
                  {renderMaterialInputs}

                  {this.state.materials.length < materials.length && (
                    <button
                      className="btn btn-primary mr-2 mt-2"
                      onClick={this.addMaterial}
                    >
                      <i className="fas fa-plus"></i> Добавить Материал
                    </button>
                  )}

                  {this.state.materials.length === 1 ? '' : (
                    <button
                      className="btn btn-danger mt-2"
                      onClick={this.deleteMaterial}
                    >
                      <i className="fas fa-trash-alt"></i> Удалить последний материал
                    </button>
                  )}

                  <div className="border-bottom"></div>

                  <button
                    type="submit"
                    className="btn btn-success"
                  >
                    <i className="fas fa-marker"></i> Изменить материалы
                  </button>
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

export default connect(mapStateToProps, { getUserById, setDisinfectorMaterials })(withRouter(SetDisinfectorMaterials));