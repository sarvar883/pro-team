import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import materials from '../common/materials';
import removeZeros from '../../utils/removeZerosMat';

import { getAllDisinfectorsAndSubadmins, getCurrentMaterials, addMaterialToDisinfector } from '../../actions/adminActions';

class AdminMaterials extends Component {
  state = {
    array: [{}],
    currentMaterials: [],
    materials: [
      {
        material: '',
        amount: 0,
        unit: ''
      }
    ],
    disinfector: ''
  };

  componentDidMount() {
    this.props.getCurrentMaterials();
    this.props.getAllDisinfectorsAndSubadmins();
    window.scrollTo({ top: 0 });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentMaterials: nextProps.admin.currentMaterials.materials
    });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  changeSelect = (e) => {
    const index = e.target.name.split('-')[1];
    let newMaterialsArray = this.state.materials;
    newMaterialsArray[index].material = e.target.value.split('+')[0];
    newMaterialsArray[index].unit = e.target.value.split('+')[1];
    this.setState({
      materials: newMaterialsArray
    });
  }

  changeAmount = (e) => {
    const index = e.target.name.split('-')[1];
    let newMaterialsArray = this.state.materials;
    newMaterialsArray[index].amount = Number(e.target.value);
    this.setState({
      materials: newMaterialsArray
    });
  }

  addMaterial = (e) => {
    e.preventDefault();
    let newArray = this.state.array;
    newArray.push({});
    let newMaterialsArray = this.state.materials;
    newMaterialsArray.push({
      material: '',
      amount: 0,
      unit: ''
    });
    this.setState({
      array: newArray,
      materials: newMaterialsArray
    });
  }

  deleteMaterial = (e) => {
    e.preventDefault();
    let newArray = this.state.array;
    newArray.pop();
    let newMaterialsArray = this.state.materials;
    newMaterialsArray.pop();
    this.setState({
      array: newArray,
      materials: newMaterialsArray
    });
  }

  onSubmit = (e) => {
    e.preventDefault();
    let emptyFields = 0, notEnoughMaterials = 0, zeroValues = 0;
    this.state.materials.forEach(item => {
      if (item.material === '') {
        emptyFields++;
      }
      if (item.amount <= 0) {
        zeroValues++;
      }
      this.state.currentMaterials.forEach(element => {
        if (item.material === element.material && item.unit === element.unit && item.amount > element.amount) {
          notEnoughMaterials++;
          return;
        }
      });
    });

    if (emptyFields > 0) {
      alert('Заполните Поле "Выберите Материал и Количество"');
    } else if (zeroValues > 0) {
      alert('Количество Материала не может быть нулем или отрицательнам числом');
    } else if (notEnoughMaterials > 0) {
      alert('У вас недостаточно материалов');
    } else {
      const object = {
        disinfector: this.state.disinfector,
        admin: this.props.auth.user.id,
        materials: this.state.materials
      };
      this.props.addMaterialToDisinfector(object, this.props.auth.user.occupation, this.props.history);
      this.props.getAllDisinfectorsAndSubadmins();
    }
  }

  render() {
    let showDisinfectors = this.props.admin.disinfectors.map((item, index) => {
      let matArray = removeZeros([...item.materials]);

      let disinfectorMaterials = matArray.map((material, number) =>
        <li key={number}>{material.material}: {material.amount} {material.unit}</li>
      );

      return (
        <div className="col-lg-4 col-md-6" key={index}>
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 list-unstyled">
                <h4 className="text-center">{item.occupation} {item.name}</h4>
                <p className="mb-0">Имеется в наличии материалов:</p>
                <ul>
                  {disinfectorMaterials}
                </ul>
              </ul>
            </div>
          </div>
        </div>
      )
    });

    let consumptionMaterials = [
      { label: '-- Выберите вещество --', value: "", unit: "" }
    ];

    materials.forEach(item => {
      consumptionMaterials.push({
        label: item.material,
        value: item.material,
        unit: item.unit
      })
    });

    const materialOptions = consumptionMaterials.map((option, index) =>
      <option value={`${option.value}+${option.unit}`} key={index}>{option.label} {option.unit}</option>
    );

    let renderMaterials = this.state.array.map((item, index) =>
      <React.Fragment key={index}>
        <div className="form-group">
          <select name={`consumption-${index}`} className="form-control" onChange={this.changeSelect} required>
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

    let disinfectorOptions = [
      { label: '-- Выберите пользователя --', value: "" }
    ];

    this.props.admin.disinfectors.forEach(worker => disinfectorOptions.push({
      label: `${worker.occupation} ${worker.name}`, value: worker._id
    }));

    // current materials
    let currentMat = removeZeros([...this.state.currentMaterials]);

    let renderCurMat = currentMat.map((item, index) =>
      <li key={index}>{item.material}: {item.amount} {item.unit}</li>
    );


    return (
      <div className="container-fluid">
        {this.props.admin.loadingCurMat ? <Spinner /> :
          <div className="row mt-2">
            <div className="col-lg-6 col-md-8 m-auto">
              <div className="card order mt-2">
                <div className="card-body p-0">
                  <h3 className="text-center">Сейчас имеется материалов на складе</h3>
                  <ul className="font-bold mb-0 list-unstyled">
                    {renderCurMat}
                    <li>Последнее обновление: <Moment format="DD/MM/YYYY HH:mm">{this.props.admin.currentMaterials.lastUpdated}</Moment></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        }

        <div className="row mt-3">
          <div className="col-12">
            <h3 className="text-center">Материалы у пользователей</h3>
          </div>
        </div>

        {this.props.admin.loadingDisinfectors ? <Spinner /> :
          <div className="row mt-2">
            {showDisinfectors}
          </div>
        }

        <div className="row mt-3">
          <div className="col-lg-6 col-md-8 mx-auto">
            <div className="card mt-2">
              <div className="card-body">
                <h2 className="text-center">Добавить Материалы Пользователю</h2>
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <label htmlFor="disinfector">Выберите Пользователя:</label>
                    {this.props.admin.loadingDisinfectors ? (
                      <p>Дезинфекторы загружаются...</p>
                    ) : (
                      <select value={this.state.disinfector} name="disinfector" className="form-control" onChange={this.onChange} required>
                        {disinfectorOptions.map((item, index) =>
                          <option value={item.value} key={index}>{item.label}</option>
                        )}
                      </select>
                    )}
                  </div>

                  <label htmlFor="consumption">Выберите Материал и Количество:</label>
                  {renderMaterials}

                  {this.state.array.length < materials.length ? <button className="btn btn-primary mr-2 mt-2" onClick={this.addMaterial}>Добавить Материал</button> : ''}

                  {this.state.array.length === 1 ? '' : <button className="btn btn-danger mt-2" onClick={this.deleteMaterial}>Удалить последний материал</button>}

                  <div className="border-bottom"></div>

                  <button type="submit" className="btn btn-success">Добавить Пользователю</button>
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

export default connect(mapStateToProps, { getAllDisinfectorsAndSubadmins, getCurrentMaterials, addMaterialToDisinfector })(withRouter(AdminMaterials));