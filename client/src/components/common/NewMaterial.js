import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import TextFieldGroup from '../common/TextFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import DeleteMaterial from './DeleteMaterial';

import { addNewMaterial } from '../../actions/adminActions';


class NewMaterial extends Component {
  state = {
    material: '',
    unit: '',
    errors: {}
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = () => {
    let object = {
      material: this.state.material,
      unit: this.state.unit
    };

    this.props.addNewMaterial(object, this.props.history);
  };

  render() {
    const { errors } = this.state;

    const units = [
      { label: '-- Введите единицу измерения --', value: '' },
      { label: 'гр', value: 'гр' },
      { label: 'шт', value: 'шт' },
      { label: 'мл', value: 'мл' },
      { label: 'пак', value: 'пак' }
    ];

    return (
      <div className="container-fluid mt-4">
        <div className="row">

          {/* Create New Material Form */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h3 className="text-center">Добавить Новый Материал</h3>
                <form onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    label="Введите Имя Материала"
                    type="text"
                    name="material"
                    value={this.state.material}
                    onChange={this.onChange}
                    error={errors.material}
                    required
                  />
                  <SelectListGroup
                    name="unit"
                    value={this.state.unit}
                    onChange={this.onChange}
                    error={errors.unit}
                    options={units}
                    required
                  />
                  <button type="submit" className="btn btn-success">Добавить</button>
                </form>
              </div>
            </div>
          </div>


          {/* Create Delete Material Form */}
          <DeleteMaterial />
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

export default connect(mapStateToProps, { addNewMaterial })(withRouter(NewMaterial));