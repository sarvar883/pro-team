import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import TextFieldGroup from '../common/TextFieldGroup';

import { deleteMaterialFromDB } from '../../actions/adminActions';


class DeleteMaterial extends Component {
  state = {
    material: '',

    errors: {},
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onDeleteMaterial = () => {
    let object = {
      material: this.state.material,
    };
    // console.log('onDeleteMaterial', object);
    this.props.deleteMaterialFromDB(object, this.props.history)
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h3 className="text-center">Удалить Материал из БД</h3>

            <p>* имя материала должно точно совпадать с именем материала в БД и в materials.js (регистр букв тоже должен совпадать)</p>

            <form onSubmit={this.onDeleteMaterial}>
              <TextFieldGroup
                label="Введите Имя Материала, которого нужно удалить"
                type="text"
                name="material"
                value={this.state.material}
                onChange={this.onChange}
                error={errors.material}
                required
              />

              <button type="submit" className="btn btn-danger">Удалить</button>
            </form>
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

export default connect(mapStateToProps, { deleteMaterialFromDB })(withRouter(DeleteMaterial));