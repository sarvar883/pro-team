import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import { getCurrentMaterials, addMatComing } from '../../actions/adminActions';

import materials from '../common/materials';
import removeZeros from '../../utils/removeZerosMat';

class MatComing extends Component {
  state = {
    array: [{}],
    currentMaterials: [],
    materials: [
      {
        material: '',
        amount: 0,
        unit: ''
      }
    ]
  };

  componentDidMount() {
    this.props.getCurrentMaterials();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentMaterials: nextProps.admin.currentMaterials.materials
    });
  }

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
    let emptyFields = 0, zeroValues = 0;
    this.state.materials.forEach(item => {
      if (item.material === '') {
        emptyFields++;
      }
      if (item.amount <= 0) {
        zeroValues++;
      }
    });
    if (emptyFields > 0) {
      alert('Заполните Поле "Выберите Материал и Количество"');
    } else if (zeroValues > 0) {
      alert('Количество Материала не может быть нулем или отрицательнам числом');
    } else {
      const object = {
        admin: this.props.auth.user.id,
        materials: this.state.materials
      };
      this.props.addMatComing(object, this.props.history);
    }
  }

  render() {
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

    // current materials
    let currentMat = removeZeros([...this.state.currentMaterials]);

    let renderCurMat = currentMat.map((item, index) =>
      <li key={index}>{item.material}: {item.amount} {item.unit}</li>
    );

    return (
      <div className="container-fluid">
        <div className="row mt-2">
          <div className="col-lg-6 col-md-8">
            {this.props.admin.loadingCurMat ? <Spinner /> :
              <div className="card order mt-2">
                <div className="card-body p-0">
                  <h3 className="text-center">Сейчас имеется материалов на складе</h3>
                  <ul className="font-bold mb-0 list-unstyled">
                    {renderCurMat}
                    <li className="mt-2">Последнее обновление: <Moment format="DD/MM/YYYY HH:mm">{this.props.admin.currentMaterials.lastUpdated}</Moment></li>

                    <Link
                      to='/admin/set-current-materials'
                      className="btn btn-warning mt-2"
                    >
                      <i className="fas fa-marker"></i> Изменить материалы на складе
                    </Link>
                  </ul>
                </div>
              </div>
            }
          </div>

          <div className="col-lg-6 col-md-8">
            <div className="card mt-2">
              <div className="card-body">
                <h3 className="text-center">Приход Материалов</h3>
                <form onSubmit={this.onSubmit}>
                  <label htmlFor="consumption">Выберите Материал и Количество:</label>
                  {renderMaterials}
                  {this.state.array.length < materials.length ? <button className="btn btn-primary mr-2 mt-2" onClick={this.addMaterial}><i className="fas fa-plus"></i> Добавить Материал</button> : ''}

                  {this.state.array.length === 1 ? '' : <button className="btn btn-danger mt-2" onClick={this.deleteMaterial}><i className="fas fa-trash-alt"></i> Удалить последний материал</button>}

                  <div className="border-bottom"></div>

                  <button type="submit" className="btn btn-success"><i className="fas fa-plus-circle"></i> Добавить приход материалов</button>
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

export default connect(mapStateToProps, { getCurrentMaterials, addMatComing })(withRouter(MatComing));