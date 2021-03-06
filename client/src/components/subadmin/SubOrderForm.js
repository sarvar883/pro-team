import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import { getOrderById, submitCompleteOrder } from '../../actions/orderActions';
import { getDisinfectorMaterials, getAllDisinfectorsAndSubadmins } from '../../actions/disinfectorActions';

import materials from '../common/materials';
import removeZeros from '../../utils/removeZerosMat';
import getContractsString from '../../utils/getContractString';

class SubOrderForm extends Component {
  state = {
    // logged in disinfector
    loggedDisinf: {
      disinfectorId: this.props.auth.user.id,
      consumption: [{
        material: '',
        amount: '',
        unit: ''
      }]
    },
    loggedHelpArray: [{}],

    // other disinfectors
    array: [],

    disinfectorAmount: 1,
    paymentMethod: '',
    cost: '',
    inputContractFormat: 'manually',
    contractNumber: '',
    guarantee: '',
    disinfectorComment: this.props.subadmin.orderById.disinfectorComment,

    allDisinfectors: []
  };

  componentDidMount() {
    this.props.getOrderById(this.props.match.params.id);
    this.props.getAllDisinfectorsAndSubadmins();
    this.props.getDisinfectorMaterials(this.props.auth.user.id);
    window.scrollTo({ top: 0 });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      allDisinfectors: nextProps.subadmin.disinfectors
    });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  changeContractInputFormat = (format, e) => {
    e.preventDefault();
    this.setState({
      inputContractFormat: format,
      contractNumber: ''
    });
  };

  changeDisinfectorAmount = (e) => {
    const disinfectorAmount = Number(e.target.value);
    let emptyObject = {
      disinfectorId: '',
      consumption: [{
        material: '',
        amount: '',
        unit: ''
      }],
      helpArray: [{}]
    };

    // let newArray = [];
    let newArray = [...this.state.array];

    if (disinfectorAmount > this.state.array.length) {
      for (let i = 1; i <= disinfectorAmount - this.state.array.length; i++) {
        newArray.push(emptyObject);
      }
    } else if (disinfectorAmount < this.state.array.length) {
      for (let i = 1; i <= this.state.array.length - disinfectorAmount; i++) {
        newArray.pop();
      }
    }

    this.setState({
      array: newArray,
      disinfectorAmount: disinfectorAmount
    });
  }


  // For logged in dosinfector
  changeLoggedSelect = (e) => {
    const index = e.target.name.split('-')[1];
    let newArray = this.state.loggedDisinf;
    newArray.consumption[index].material = e.target.value.split('+')[0];
    newArray.consumption[index].unit = e.target.value.split('+')[1];
    this.setState({
      loggedDisinf: newArray
    });
  }

  changeLoggedAmount = (e) => {
    const index = e.target.name.split('-')[1];
    let newArray = this.state.loggedDisinf;
    newArray.consumption[index].amount = Number(e.target.value);
    this.setState({
      loggedDisinf: newArray
    });
  }

  addMaterialLogged = (e) => {
    e.preventDefault();
    let newHelpArray = this.state.loggedHelpArray;
    newHelpArray.push({});
    let newArray = this.state.loggedDisinf;
    newArray.consumption.push({
      material: '',
      amount: '',
      unit: ''
    });
    this.setState({
      loggedHelpArray: newHelpArray,
      loggedDisinf: newArray
    });
  }

  deleteMaterialLogged = (e) => {
    e.preventDefault();
    let newHelpArray = this.state.loggedHelpArray;
    newHelpArray.pop();
    let newArray = this.state.loggedDisinf;
    newArray.consumption.pop();
    this.setState({
      loggedHelpArray: newHelpArray,
      loggedDisinf: newArray
    });
  }


  // for other disinfectors
  changeDisinfector = (e) => {
    const index = Number(e.target.name.split('-')[1]);
    let newArray = [...this.state.array];
    newArray[index] = {
      ...this.state.array[index],
      disinfectorId: e.target.value
    };
    this.setState({
      array: newArray
    });
  }

  changeSelect = (e) => {
    const disinfIndex = Number(e.target.name.split('-')[1]);
    const materialIndex = Number(e.target.name.split('-')[2]);
    const newMaterial = e.target.value.split('+')[0];
    const newUnit = e.target.value.split('+')[1];

    let newArray = [...this.state.array];

    newArray[disinfIndex] = {
      ...this.state.array[disinfIndex],
      consumption: [
        ...this.state.array[disinfIndex].consumption
      ]
    }
    newArray[disinfIndex].consumption[materialIndex] = {
      ...this.state.array[disinfIndex].consumption[materialIndex],
      material: newMaterial,
      unit: newUnit
    }

    this.setState({
      array: newArray
    });
  }

  changeAmount = (e) => {
    const disinfIndex = Number(e.target.name.split('-')[1]);
    const materialIndex = Number(e.target.name.split('-')[2]);
    const newAmount = Number(e.target.value);

    let newArray = [...this.state.array];

    newArray[disinfIndex] = {
      ...this.state.array[disinfIndex],
      consumption: [
        ...this.state.array[disinfIndex].consumption
      ]
    }

    newArray[disinfIndex].consumption[materialIndex] = {
      ...this.state.array[disinfIndex].consumption[materialIndex],
      amount: newAmount
    }

    this.setState({
      array: newArray
    });
  }

  addMatDisinf = (disinfIndex, e) => {
    e.preventDefault();
    const emptyElement = {
      material: '',
      amount: '',
      unit: ''
    };
    let newArray = [...this.state.array];

    newArray[disinfIndex] = {
      ...this.state.array[disinfIndex],
      consumption: [
        ...this.state.array[disinfIndex].consumption, emptyElement
      ],
      helpArray: [
        ...this.state.array[disinfIndex].helpArray, {}
      ]
    }
    this.setState({
      array: newArray
    });
  }

  deleteMatDisinf = (disinfIndex, e) => {
    e.preventDefault();

    let newArray = [...this.state.array];
    let newConsumption = [...newArray[disinfIndex].consumption];
    let newHelpArray = [...newArray[disinfIndex].helpArray];
    newConsumption.pop();
    newHelpArray.pop();
    newArray[disinfIndex] = {
      ...this.state.array[disinfIndex],
      consumption: newConsumption,
      helpArray: newHelpArray
    }

    this.setState({
      array: newArray
    });
  }

  onSubmit = (e) => {
    e.preventDefault();

    let loggedDisinfNotEnoughMat = 0,
      duplicateDisinfectors = 0,
      disinfNotEnoughMat = 0,
      zeroValues = 0,
      emptyFields = 0,
      contractNumberEntered = 0;

    // check if logged in disinfector has enough materials
    this.state.loggedDisinf.consumption.forEach(item => {
      // check if material fields of logged in disinfector are not empty
      if (item.material === '') {
        emptyFields++;
      }
      // check if material amount of logged in disinfector are not 0 or negative numbers
      if (item.amount <= 0) {
        zeroValues++;
      }

      this.props.auth.user.materials.forEach(element => {
        if (item.material === element.material && item.unit === element.unit && item.amount > element.amount) {
          loggedDisinfNotEnoughMat++;
        }
      })
    });

    // check for duplicates in disinfectors array
    this.state.array.forEach((item, index) => {
      for (let i = index + 1; i < this.state.array.length; i++) {
        if (item.disinfectorId === this.state.array[i].disinfectorId) {
          duplicateDisinfectors++;
        }
      }
    });

    // check if disinfectors have enough materials
    this.state.array.forEach(item => {
      this.state.allDisinfectors.forEach(disinfector => {
        if (item.disinfectorId === disinfector._id) {
          item.consumption.forEach(element => {
            // check if material amount fields are not 0 or negative numbers
            if (element.amount <= 0) {
              zeroValues++;
            }
            // check if material fields are not empty
            if (element.material === '') {
              emptyFields++;
            }
            disinfector.materials.forEach(object => {
              if (element.material === object.material && element.unit === object.unit && element.amount > object.amount) {
                disinfNotEnoughMat++;
              }
            });
          });
        }
      });
    });

    // check if contractNumber is entered
    if (
      this.state.paymentMethod === 'notCash' &&
      this.state.inputContractFormat === 'select' &&
      this.state.contractNumber === ''
    ) {
      contractNumberEntered++;
    }

    if (zeroValues > 0) {
      alert('???????????????????? ?????????????????? ???? ?????????? ???????? ?????????? ?????? ?????????????????????????? ????????????');
    } else if (emptyFields > 0) {
      alert('?????????????????? ?????? ???????? "???????????? ????????????????????"');
    } else if (loggedDisinfNotEnoughMat > 0) {
      alert('?? ?????? ???????????????????????? ????????????????????');
    } else if (duplicateDisinfectors > 0) {
      alert('???? ?????????????? ???????????????????? ??????????????????????????');
    } else if (disinfNotEnoughMat > 0) {
      alert('?? ?????????????????????????? ???????????????????????? ????????????????????');
    } else if (contractNumberEntered > 0) {
      alert('?????????????? ?????????? ????????????????');
    } else {

      let paymentMethod;
      if (this.props.order.orderById.clientType === 'individual') {
        paymentMethod = 'cash';
      } else if (this.props.order.orderById.clientType === 'corporate') {
        paymentMethod = this.state.paymentMethod;
      }

      let newArray = [this.state.loggedDisinf, ...this.state.array];
      let order = {
        clientType: this.props.order.orderById.clientType,
        orderId: this.props.match.params.id,
        paymentMethod: paymentMethod,
        cost: this.state.cost,
        guarantee: this.state.guarantee,
        contractNumber: this.state.contractNumber,
        disinfectorComment: this.state.disinfectorComment,
        disinfectors: newArray
      };
      this.props.submitCompleteOrder(order, this.props.history, this.props.auth.user.occupation);
    }
  };

  render() {
    const order = this.props.subadmin.orderById;


    let consumptionMaterials = [
      { label: '-- ???????????????? ???????????????? --', value: "", unit: "" }
    ];

    materials.forEach(item => {
      consumptionMaterials.push({
        label: item.material,
        value: item.material,
        unit: item.unit
      })
    });

    const consumptionOptions = consumptionMaterials.map((option, index) =>
      <option value={`${option.value}+${option.unit}`} key={index}>{option.label} {option.unit}</option>
    );


    let disinfectorAmountOptions = [
      { label: '-- ?????????????? ?????????????????????????? (?????????? ??????) ?????????????????? ??????????? --', value: "" },
      { label: '?????????? ?????????????????? ???????????? ????', value: 0 }
    ];

    let disinfectorSelectOptions = [
      { label: '-- ???????????????? ???????????????????????? -- ', value: "" }
    ];




    this.state.allDisinfectors.forEach((user, index) => {
      disinfectorAmountOptions.push({
        label: index + 1, value: index + 1
      });

      // do not include logged in disinfector to disinfector select options
      if (user._id !== this.props.auth.user.id) {
        disinfectorSelectOptions.push({
          label: `${user.occupation} ${user.name}`, value: user._id
        });
      }
    });

    let renderDisinfectorAmountOptions = disinfectorAmountOptions.map((item, number) =>
      <option value={item.value} key={number}>{item.label}</option>
    );
    let renderDisinfOptions = disinfectorSelectOptions.map((item, number) =>
      <option value={item.value} key={number}>{item.label}</option>
    );

    // render logged in disinfector materials
    let loggedMat = removeZeros([...this.props.auth.user.materials]);
    let loggedDisinfMaterials = loggedMat.map((item, index) =>
      <li key={index}>{item.material}: {item.amount} {item.unit}</li>
    );


    let renderLoggedDisinfForm = this.state.loggedHelpArray.map((item, index) =>
      <React.Fragment key={index}>
        <div className="form-group">
          <select name={`loggedConsumption-${index}`} className="form-control" onChange={this.changeLoggedSelect} required>
            {consumptionOptions}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor={`loggedQuantity-${index}`}>????????????????????:</label>
          <input
            type="number"
            step="0.001"
            className="form-control"
            name={`loggedQuantity-${index}`}
            onChange={this.changeLoggedAmount}
            required
          />
        </div>
        <div className="border-bottom-red"></div>
      </React.Fragment>
    );


    let renderDisinfForms = this.state.array.map((item, index) => {
      let renderFields = item.helpArray.map((element, number) =>
        <React.Fragment key={number}>
          <div className="form-group">
            <select name={`consumption-${index}-${number}`} className="form-control" onChange={this.changeSelect} required>
              {consumptionOptions}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor={`quantity-${index}-${number}`}>????????????????????:</label>
            <input
              type="number"
              step="0.001"
              className="form-control"
              name={`quantity-${index}-${number}`}
              onChange={this.changeAmount}
              required
            />
          </div>

          <div className="border-bottom-red"></div>
        </React.Fragment>
      );

      return (
        <React.Fragment key={index}>
          <h3>?????????????????????? {index + 1}</h3>
          <div className="form-group">
            <select name={`dis-${index}`} className="form-control" onChange={this.changeDisinfector} required>
              {renderDisinfOptions}
            </select>
          </div>
          {renderFields}

          {item.helpArray.length < materials.length ? <button className="btn btn-primary mr-2" onClick={this.addMatDisinf.bind(this, index)}>???????????????? ????????????????</button> : ''}

          {item.helpArray.length === 1 ? '' : <button className="btn btn-danger" onClick={this.deleteMatDisinf.bind(this, index)}>?????????????? ?????????????????? ????????????????</button>}

          <div className="border-bottom"></div>
        </React.Fragment>
      );
    });



    // IF THIS IS A RETURNED QUERY
    let renderReturnedOrder = '';
    if (order.returnedBack && !order.returnHandled) {
      let consumptionArray = [];
      order.disinfectors.forEach(item => {
        consumptionArray.push({
          user: item.user,
          consumption: item.consumption
        });
      });

      let consumptionRender = consumptionArray.map((item, index) =>
        <li key={index}>
          <p className="mb-0">????????????????????????: {item.user.occupation} {item.user.name}</p>
          {item.consumption.map((element, number) =>
            <p key={number} className="mb-0">{element.material}: {element.amount.toLocaleString()} {element.unit}</p>
          )}
        </li>
      );

      renderReturnedOrder = (
        <div className="col-lg-4 col-md-6">
          <div className="card order mt-2">
            <div className="card-body p-0">
              <ul className="font-bold mb-0 list-unstyled">
                <h4>?????? ???????????????????????? ??????????</h4>
                <li>?? ?????????????? ?????? ???? ?????????????????? ?????????? ????????????????????:</li>

                <li>???????????? ???????????????????? (?????????? ?????????????????? {order.disinfectors.length} ??????):</li>
                <ul className="font-bold mb-0">
                  {consumptionRender}
                </ul>

                <li>???????? ???????????????? (?? ??????????????): {order.guarantee}</li>

                {order.clientType === 'corporate' ? (
                  <React.Fragment>
                    {order.paymentMethod === 'cash' ? (
                      <React.Fragment>
                        <li>?????? ??????????????: ????????????????</li>
                        <li>?????????? ??????????: {order.cost.toLocaleString()} UZS (?????????????? ???? {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <li>?????? ??????????????: ??????????????????????</li>
                        <li>?????????? ????????????????: {order.contractNumber}</li>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ) : ''}

                {order.clientType === 'individual' ?
                  <li>?????????? ??????????: {order.cost.toLocaleString()} UZS  (?????????????? ???? {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                  : ''}

                <li>?????????? ???????????????????? ???????????? ???????? ??????????????????: <Moment format="DD/MM/YYYY HH:mm">{order.completedAt}</Moment></li>

              </ul>
            </div>
          </div>
        </div>
      );
    }
    // END OF IF THIS IS A RETURNED QUERY



    let contractNumbers = [];
    if (order.clientType === 'corporate' && order.clientId && order.clientId.contracts) {
      contractNumbers = [...order.clientId.contracts];
    }
    let renderContractOptions = contractNumbers.map((item, key) =>
      <option value={item} key={key}>{item}</option>
    );


    return (
      <div className="container-fluid p-0">
        {this.props.subadmin.loading ? <Spinner /> : (
          <React.Fragment>
            <div className="row m-0">
              <div className="col-12">
                <h2 className="text-center">???????????????????? ?? ????????????</h2>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card order mt-2">
                  <div className="card-body p-0">
                    <ul className="font-bold mb-0 list-unstyled">
                      <li>??????????????????????????: {order.disinfectorId.occupation} {order.disinfectorId.name}</li>

                      {order.clientType === 'corporate' ?
                        <React.Fragment>
                          {order.clientId ? (
                            <React.Fragment>
                              <li className="text-danger">?????????????????????????? ????????????: {order.clientId.name}</li>
                              <li className="text-danger">??????: {order.clientId.inn || '--'}</li>
                              <li className="text-danger">???????????? ??????????????????: {getContractsString(contractNumbers)}</li>
                            </React.Fragment>
                          ) : <li className="text-danger">?????????????????????????? ????????????</li>}
                          <li className="text-danger">?????? ??????????????: {order.client}</li>
                        </React.Fragment>
                        : ''}
                      {order.clientType === 'individual' ?
                        <li className="text-danger">???????????????????? ????????????: {order.client}</li> : ''
                      }
                      <li className="text-danger">?????????????? ??????????????: {order.phone}</li>
                      {order.phone2 !== '' ? <li className="text-danger">???????????????? ?????????????? ??????????????: {order.phone2}</li> : ''}
                      <li className="text-danger">????????: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                      <li className="text-danger">?????????? ????????????????????: <Moment format="HH:mm">{order.dateFrom}</Moment></li>
                      <li className="text-danger">??????????: {order.address}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="card order mt-2">
                  <div className="card-body p-0">
                    <ul className="font-bold mb-0 list-unstyled">
                      <li className="text-danger">?????? ????????????: {order.typeOfService}</li>
                      <li>?????????????????????? ??????????????????: {order.comment ? order.comment : '--'}</li>
                      <li>?????????????????????? ????????????????????????: {order.disinfectorComment ? order.disinfectorComment : '--'}</li>

                      {order.userAcceptedOrder ? (
                        <li>?????? ???????????? ??????????: {order.userAcceptedOrder.occupation} {order.userAcceptedOrder.name}</li>
                      ) : ''}

                      {order.userCreated ? (
                        <li>?????????? ????????????????: {order.userCreated.occupation} {order.userCreated.name} <Moment format="DD/MM/YYYY HH:mm">{order.createdAt}</Moment></li>
                      ) : ''}

                    </ul>
                  </div>
                </div>
              </div>

              {order.returnedBack ? renderReturnedOrder : ''}
            </div>

            <div className="row m-0">
              <div className="col-md-4">
                <div className="card order mt-2">
                  <div className="card-body p-0">
                    <h4 className="text-center">???????? ?????????????????? ??????????????????</h4>
                    <ul className="font-bold mb-0">
                      {loggedDisinfMaterials}
                    </ul>
                  </div>
                </div>
              </div>

              {/* {renderDisinfectorMaterials} */}
            </div>

            <div className="row m-0">
              <div className="col-lg-6 col-md-8 m-auto">
                <div className="card mt-3 mb-3">
                  <div className="card-body">
                    <h1 className="text-center">?????????? ?? ???????????????????? ????????????</h1>
                    <form onSubmit={this.onSubmit}>
                      <div className="form-group">
                        <select name="disinfectorAmount" className="form-control" onChange={this.changeDisinfectorAmount.bind(this)} required>
                          {renderDisinfectorAmountOptions}
                        </select>
                      </div>

                      <div className="border-bottom"></div>

                      {/* for logged in desinfector */}
                      <h3>?????? ???????????? ????????????????????</h3>
                      {renderLoggedDisinfForm}

                      {this.state.loggedHelpArray.length < materials.length ? <button className="btn btn-primary mr-2" onClick={this.addMaterialLogged}>???????????????? ????????????????</button> : ''}

                      {this.state.loggedHelpArray.length === 1 ? '' : <button className="btn btn-danger" onClick={this.deleteMaterialLogged}>?????????????? ?????????????????? ????????????????</button>}

                      <div className="border-bottom"></div>

                      {renderDisinfForms}

                      <div className="form-group">
                        <label htmlFor="disinfectorComment">?????????????????????? ????????????????????????:</label>
                        <textarea className="form-control" name="disinfectorComment" placeholder="?????? ??????????????????????" onChange={this.onChange} rows="3" defaultValue={order.disinfectorComment}></textarea>
                      </div>

                      <div className="form-group">
                        <label htmlFor="guarantee">?????????????????????? ???????? (?? ??????????????):</label>
                        <input type="number" min="0" step="1" className="form-control" name="guarantee" onChange={this.onChange} required />
                      </div>

                      {order.clientType === 'corporate' ?
                        <div className="form-group">
                          <label htmlFor="paymentMethod">?????? ??????????????:</label>
                          <select name='paymentMethod' className="form-control" onChange={this.onChange} required>
                            <option value="">-- ???????????????? ?????? ?????????????? --</option>
                            <option value="cash">????????????????</option>
                            <option value="notCash">??????????????????????</option>
                          </select>
                        </div>
                        : ''}

                      {order.clientType === 'individual' || this.state.paymentMethod === 'cash' ?
                        <div className="form-group">
                          <label htmlFor="cost">?????????? ????????????: (?? ??????????)</label>
                          <input type="number" step="1" className="form-control" name='cost' onChange={this.onChange} required />
                        </div>
                        : ''}

                      {order.clientType === 'corporate' && this.state.paymentMethod === 'notCash' ?
                        <React.Fragment>
                          {this.state.inputContractFormat === 'manually' ? (
                            <button className="btn btn-primary mt-2"
                              onClick={this.changeContractInputFormat.bind(this, 'select')}
                            >?????????????? ?????????? ???????????????? ???? ????????????</button>
                          ) : (
                            <button className="btn btn-primary mt-2"
                              onClick={this.changeContractInputFormat.bind(this, 'manually')}
                            >???????????? ?????????? ???????????????? ??????????????</button>
                          )}

                          {this.state.inputContractFormat === 'manually' && (
                            <div className="form-group mt-3">
                              <label htmlFor="contractNumber">?????????? ????????????????:</label>
                              <input type="text" className="form-control" name='contractNumber' onChange={this.onChange} required />
                            </div>
                          )}

                          {this.state.inputContractFormat === 'select' && (
                            <React.Fragment>
                              {contractNumbers.length === 0 ? (
                                <h4>?? ?????????????? ?????? ?????????????? ????????????????. ?????????????? ??????????????</h4>
                              ) : (
                                <div className="form-group mt-3">
                                  <label htmlFor="contractNumber">???????????????? ?????????? ???????????????? ??????????????:</label>
                                  <select name='contractNumber' className="form-control" onChange={this.onChange} required>
                                    <option value="">-- ???????????????? ?????? ?????????????? --</option>
                                    {renderContractOptions}
                                  </select>
                                </div>
                              )}
                            </React.Fragment>
                          )}

                        </React.Fragment>
                        : ''}

                      <div className="border-bottom"></div>

                      <button className="btn btn-success">?????????????????? ???????????? ?? ????????????????????</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  subadmin: state.subadmin,
  errors: state.errors
});

export default connect(mapStateToProps, { getOrderById, getDisinfectorMaterials, getAllDisinfectorsAndSubadmins, submitCompleteOrder })(withRouter(SubOrderForm));