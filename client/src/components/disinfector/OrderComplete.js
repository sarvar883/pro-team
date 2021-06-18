import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import Moment from 'react-moment';

import {
  getOrderById,
  submitCompleteOrder
} from '../../actions/orderActions';
import {
  getDisinfectorMaterials,
  getAllDisinfectorsAndSubadmins
} from '../../actions/disinfectorActions';

import materials from '../common/materials';
import removeZeros from '../../utils/removeZerosMat';
import getContractsString from '../../utils/getContractString';


class OrderComplete extends Component {
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
    disinfectorComment: this.props.order.orderById.disinfectorComment,

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
      allDisinfectors: nextProps.disinfector.disinfectors
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

    // if (disinfectorAmount > 0) {
    //   for (let i = 1; i <= disinfectorAmount; i++) {
    //     newArray.push(emptyObject);
    //   }
    // }

    this.setState({
      array: newArray,
      disinfectorAmount: disinfectorAmount
    });
  }


  // For logged in disinfector
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
      emptyFields = 0;

    // let contractNumberEntered = 0;

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


    // ---------------------------------
    // check if contractNumber is entered
    // contractNumber is not required 24.03.2021
    // if (
    //   this.state.paymentMethod === 'notCash' &&
    //   this.state.inputContractFormat === 'select' &&
    //   this.state.contractNumber === ''
    // ) {
    //   contractNumberEntered++;
    // }
    // ---------------------------------


    if (zeroValues > 0) {
      alert('Количество материала не может быть нулем или отрицательным числом');
    } else if (emptyFields > 0) {
      alert('Заполните Все Поля "Расход Материалов"');
    } else if (loggedDisinfNotEnoughMat > 0) {
      alert('У Вас недостаточно материалов');
    } else if (duplicateDisinfectors > 0) {
      alert('Вы выбрали одинаковых дезинфекторов');
    } else if (disinfNotEnoughMat > 0) {
      alert('У дезинфекторов недостаточно материалов');
      // } else if (contractNumberEntered > 0) {
      //   alert('Введите Номер Договора');
    } else {

      let paymentMethod;
      if (this.props.order.orderById.clientType === 'individual') {
        paymentMethod = 'cash';
      } else if (this.props.order.orderById.clientType === 'corporate') {
        paymentMethod = this.state.paymentMethod;
      }


      // нужно по умолчанию записать в order.cost (строка 379) 0 по умолчанию
      let shouldCostBeZero = false;
      // console.log('props', this.props.order.orderById);
      // если заказ некачественный или повторный, то ставим 0 в order.cost
      if (this.props.order.orderById.prevFailedOrder &&
        (this.props.order.orderById.clientType === 'individual' || this.state.paymentMethod === 'cash')
      ) {
        shouldCostBeZero = true;
      }

      let newArray = [this.state.loggedDisinf, ...this.state.array];

      let order = {
        clientType: this.props.order.orderById.clientType,
        orderId: this.props.match.params.id,
        paymentMethod: paymentMethod,
        cost: shouldCostBeZero ? 0 : this.state.cost,
        guarantee: this.state.guarantee,
        contractNumber: this.state.contractNumber || '',
        disinfectorComment: this.state.disinfectorComment || '',
        disinfectors: newArray
      };
      // console.log('order', order);
      this.props.submitCompleteOrder(order, this.props.history, this.props.auth.user.occupation);
    }
  };

  render() {
    const order = this.props.order.orderById;

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

    const consumptionOptions = consumptionMaterials.map((option, index) =>
      <option value={`${option.value}+${option.unit}`} key={index}>{option.label} {option.unit}</option>
    );


    let disinfectorAmountOptions = [
      { label: '-- Сколько дезинфекторов (кроме Вас) выполнили заказ? --', value: "" },
      { label: 'Заказ выполнили только Вы', value: 0 }
    ];

    let disinfectorSelectOptions = [
      { label: '-- Выберите Дезинфектора -- ', value: "" }
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



    // TO CONSIDER

    // let renderDisinfectorMaterials = this.state.allDisinfectors.map((user, index) => {

    //   let renderItems = user.materials.map((item, i) =>
    //     <li key={i}>{item.material}: {item.amount} {item.unit}</li>
    //   );

    //   return (
    //     <div className="col-md-4" key={index}>
    //       <div className="card order mt-2">
    //         <div className="card-body p-0">
    //           <h3 className="text-center">Материалы {user.occupation} {user.name}</h3>
    //           <ul className="font-bold mb-0">
    //             {renderItems}
    //           </ul>
    //         </div>
    //       </div>
    //     </div>
    //   )
    // });
    // TO CONSIDER



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
          <label htmlFor={`loggedQuantity-${index}`}>Количество:</label>
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
            <label htmlFor={`quantity-${index}-${number}`}>Количество:</label>
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
          <h3>Дезинфектор {index + 1}</h3>
          <div className="form-group">
            <select name={`dis-${index}`} className="form-control" onChange={this.changeDisinfector} required>
              {renderDisinfOptions}
            </select>
          </div>
          {renderFields}

          {item.helpArray.length < materials.length ? <button className="btn btn-primary mr-2 mt-2" onClick={this.addMatDisinf.bind(this, index)}>Добавить Материал</button> : ''}

          {item.helpArray.length === 1 ? '' : <button className="btn btn-danger mt-2" onClick={this.deleteMatDisinf.bind(this, index)}>Удалить последний материал</button>}

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
          <p className="mb-0">Пользователь: {item.user.occupation} {item.user.name}</p>
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
                <h4>Это возвращенный заказ</h4>
                <li>В прошлый раз вы заполняли форму выполнения:</li>

                <li>Расход Материалов (заказ выполнили {order.disinfectors.length} чел):</li>
                <ul className="font-bold mb-0">
                  {consumptionRender}
                </ul>

                <li>Срок гарантии (в месяцах): {order.guarantee}</li>

                {order.clientType === 'corporate' ? (
                  <React.Fragment>
                    {order.paymentMethod === 'cash' ? (
                      <React.Fragment>
                        <li>Тип Платежа: Наличный</li>
                        <li>Общая Сумма: {order.cost.toLocaleString()} UZS (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <li>Тип Платежа: Безналичный</li>
                        <li>Номер Договора: {order.contractNumber}</li>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ) : ''}

                {order.clientType === 'individual' ?
                  <li>Общая Сумма: {order.cost.toLocaleString()} UZS  (каждому по {(order.cost / order.disinfectors.length).toLocaleString()} UZS)</li>
                  : ''}

                <li>Форма Выполнения Заказа была заполнена: <Moment format="DD/MM/YYYY HH:mm">{order.completedAt}</Moment></li>

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
        {this.props.order.loading ? <Spinner /> : (
          <React.Fragment>
            <div className="row m-0">
              <div className="col-12">
                <h2 className="text-center">Информация о заказе</h2>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="card order mt-2">
                  <div className="card-body p-0">
                    <ul className="font-bold mb-0 list-unstyled">
                      {order.prevFailedOrder && <h3><i className="fas fas fa-exclamation"></i> Повторный заказ <i className="fas fas fa-exclamation"></i></h3>}

                      {order.failed && <h3><i className="fas fas fa-exclamation"></i> Некачественный заказ <i className="fas fas fa-exclamation"></i></h3>}

                      {order.disinfectorId && (
                        <li>Ответственный: {order.disinfectorId.occupation} {order.disinfectorId.name}</li>
                      )}

                      {order.clientType === 'corporate' ? (
                        <React.Fragment>
                          {order.clientId ? (
                            <React.Fragment>
                              <li className="text-danger">Корпоративный Клиент: {order.clientId.name}</li>
                              <li className="text-danger">ИНН: {order.clientId.inn || '--'}</li>
                              <li className="text-danger">Номера Договоров: {getContractsString(contractNumbers)}</li>
                            </React.Fragment>
                          ) : <li className="text-danger">Корпоративный Клиент</li>}
                          <li className="text-danger">Имя клиента: {order.client}</li>
                        </React.Fragment>
                      ) : ''}

                      {order.clientType === 'individual' ?
                        <li className="text-danger">Физический Клиент: {order.client}</li> : ''
                      }

                      <li className="text-danger">Телефон Клиента: {order.phone}</li>
                      {order.phone2 !== '' ? <li>Запасной Телефон Клиента: {order.phone2}</li> : ''}
                      <li className="text-danger">Дата: <Moment format="DD/MM/YYYY">{order.dateFrom}</Moment></li>
                      <li className="text-danger">Время выполнения: <Moment format="HH:mm">{order.dateFrom}</Moment></li>
                      <li className="text-danger">Адрес: {order.address}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="card order mt-2">
                  <div className="card-body p-0">
                    <ul className="font-bold mb-0 list-unstyled">
                      <li className="text-danger">Тип услуги: {order.typeOfService}</li>
                      <li>Комментарии Оператора: {order.comment ? order.comment : '--'}</li>
                      <li>Комментарии Дезинфектора: {order.disinfectorComment ? order.disinfectorComment : '--'}</li>

                      {order.userAcceptedOrder ? (
                        <li>Заказ принял: {order.userAcceptedOrder.occupation} {order.userAcceptedOrder.name}</li>
                      ) : ''}

                      {order.userCreated ? (
                        <li>Заказ Добавлен: {order.userCreated.occupation} {order.userCreated.name} <Moment format="DD/MM/YYYY HH:mm">{order.createdAt}</Moment></li>
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
                    <h4 className="text-center">Ваши имеющиеся Материалы</h4>
                    <ul className="font-bold mb-0 list-unstyled">
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
                    <h3 className="text-center">Форма о Выполнении Заказа</h3>
                    <form onSubmit={this.onSubmit}>
                      <div className="form-group">
                        <select name="disinfectorAmount" className="form-control" onChange={this.changeDisinfectorAmount.bind(this)} required>
                          {renderDisinfectorAmountOptions}
                        </select>
                      </div>

                      <div className="border-bottom"></div>

                      {/* for logged in desinfector */}
                      <h3>Ваш Расход Материалов</h3>
                      {renderLoggedDisinfForm}

                      {this.state.loggedHelpArray.length < materials.length ? <button className="btn btn-primary mr-2 mt-2" onClick={this.addMaterialLogged}><i className="fas fa-plus"></i> Добавить Материал</button> : ''}

                      {this.state.loggedHelpArray.length === 1 ? '' : <button className="btn btn-danger mt-2" onClick={this.deleteMaterialLogged}><i className="fas fa-trash-alt"></i> Удалить последний материал</button>}

                      <div className="border-bottom"></div>

                      {renderDisinfForms}

                      <div className="form-group">
                        <label htmlFor="disinfectorComment">Комментарии Дезинфектора:</label>
                        <textarea className="form-control" name="disinfectorComment" placeholder="Ваш комментарий" onChange={this.onChange} rows="3" defaultValue={order.disinfectorComment}></textarea>
                      </div>

                      <div className="form-group">
                        <label htmlFor="guarantee">Гарантийный срок (в месяцах):</label>
                        <input type="number" min="0" step="1" className="form-control" name="guarantee" onChange={this.onChange} required />
                      </div>

                      {order.clientType === 'corporate' ?
                        <div className="form-group">
                          <label htmlFor="paymentMethod">Тип платежа:</label>
                          <select name='paymentMethod' className="form-control" onChange={this.onChange} required>
                            <option value="">-- Выберите Тип Платежа --</option>
                            <option value="cash">Наличный</option>
                            <option value="notCash">Безналичный</option>
                          </select>
                        </div>
                        : ''}


                      {/* у некачественных и повторных заказов сумма не вводится. По умолчанию ставим 0 в this.state.cost */}
                      {!order.prevFailedOrder &&
                        (order.clientType === 'individual' || this.state.paymentMethod === 'cash') ? (
                        <div className="form-group">
                          <label htmlFor="cost">Сумма Заказа: (в сумах)</label>
                          <input type="number" step="1" className="form-control" name='cost' onChange={this.onChange} required />
                        </div>
                      ) : ''}


                      {order.clientType === 'corporate' && this.state.paymentMethod === 'notCash' ?
                        <React.Fragment>
                          {this.state.inputContractFormat === 'manually' ? (
                            <button className="btn btn-primary mt-2"
                              onClick={this.changeContractInputFormat.bind(this, 'select')}
                            >Выбрать Номер Договора из списка</button>
                          ) : (
                            <button className="btn btn-primary mt-2"
                              onClick={this.changeContractInputFormat.bind(this, 'manually')}
                            >Ввести Номер Договора Вручную</button>
                          )}

                          {this.state.inputContractFormat === 'manually' && (
                            <div className="form-group mt-3">
                              <label htmlFor="contractNumber">Номер Договора (это поле необязательное):</label>
                              {/* <input type="text" className="form-control" name='contractNumber' onChange={this.onChange} required /> */}

                              {/* contractNumber is not required */}
                              <input type="text" className="form-control" name='contractNumber' onChange={this.onChange} />
                            </div>
                          )}

                          {this.state.inputContractFormat === 'select' && (
                            <React.Fragment>
                              {contractNumbers.length === 0 ? (
                                <h4>У клиента нет номеров договора. Введите вручную</h4>
                              ) : (
                                <div className="form-group mt-3">
                                  <label htmlFor="contractNumber">Выберите Номер Договора Клиента:</label>
                                  <select name='contractNumber' className="form-control" onChange={this.onChange} required>
                                    <option value="">-- Выберите Тип Платежа --</option>
                                    {renderContractOptions}
                                  </select>
                                </div>
                              )}
                            </React.Fragment>
                          )}

                        </React.Fragment>
                        : ''}

                      <div className="border-bottom"></div>

                      <button className="btn btn-success mt-3"><i className="fas fa-envelope-open-text"></i> Отправить Запрос О Выполнении</button>
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
  disinfector: state.disinfector,
  errors: state.errors
});

export default connect(mapStateToProps, { getOrderById, getDisinfectorMaterials, getAllDisinfectorsAndSubadmins, submitCompleteOrder })(withRouter(OrderComplete));