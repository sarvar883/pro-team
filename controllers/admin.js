const mongoose = require('mongoose');
const User = require('../models/user');
const Order = require('../models/order');
const Client = require('../models/client');
const AddMaterial = require('../models/addMaterial');
const ComingMaterial = require('../models/comingMaterial');
const CurrentMaterial = require('../models/currentMaterial');

const isEmpty = require('../validation/is-empty');

const monthHelper = require('../utils/monthMinMax');
const weekHelper = require('../utils/weekMinMax');
const dayHelper = require('../utils/dayMinMax');


exports.getSortedOrders = (req, res) => {
  const date = new Date(req.body.date);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  let minDate = new Date(year, month, day);
  let maxDate = new Date(minDate.getTime() + 1000 * 60 * 60 * 24 - 1);

  Order.find({
    $and: [
      { dateFrom: { '$gte': minDate } },
      { dateFrom: { '$lt': maxDate } }
    ]
  })
    .populate('disinfectorId clientId')
    .exec()
    .then(orders => res.json(orders))
    .catch(err => {
      console.log('getSortedOrders ADMIN ERROR', err);
      return res.status(400).json(err);
    });
};


exports.getOrderQueriesForAdmin = (req, res) => {
  Order.find({
    completed: true,
    adminDecidedReturn: false,
    adminDecided: false,
    $or: [
      { clientType: 'individual' },
      { paymentMethod: 'cash' }
    ]
  })
    .populate('disinfectorId userCreated clientId userAcceptedOrder disinfectors.user')
    .exec()
    .then(orderQueries => res.json(orderQueries))
    .catch(err => {
      console.log('getOrderQueriesForAdmin ERROR', err);
      return res.status(400).json(err);
    });
};


exports.confirmOrderQuery = (req, res) => {
  Order.findById(req.body.object.orderId)
    .then(order => {
      if (req.body.object.response === 'back') {
        order.returnedBack = true;
        order.returnHandled = false;
        order.adminDecidedReturn = true;

        order.operatorDecided = false;
        order.operatorConfirmed = false;

        order.accountantDecided = false;
        order.accountantConfirmed = false;

        // return materials to disinfectors
        req.body.object.disinfectors.forEach(person => {
          User.findById(person.user._id)
            .then(user => {
              if (user) {
                user.returnMaterials(person.consumption);
              }
            });
        });

      } else {
        order.adminDecided = true;
        order.adminCheckedAt = new Date();

        if (req.body.object.response === 'true') {
          order.adminConfirmed = true;
        } else if (req.body.object.response === 'false') {
          order.adminConfirmed = false;
        }
      }
      return order.save();
    })
    .then(savedOrder => res.json(savedOrder))
    .catch(err => {
      console.log('confirmOrderQuery ERROR', err);
      return res.status(404).json(err);
    });
};


exports.getDisinfectorsAndSubadmins = (req, res) => {
  User.find({ disabled: false })
    .or([{ occupation: 'disinfector' }, { occupation: 'subadmin' }])
    .then(disinfectors => res.json(disinfectors))
    .catch(err => {
      console.log('getDisinfectors ERROR', err);
      return res.status(404).json(err);
    });
};


exports.getOperators = (req, res) => {
  User.find({ occupation: 'operator', disabled: false })
    .then(operators => res.json(operators))
    .catch(err => {
      console.log('getOperators ERROR', err);
      return res.status(404).json(err);
    });
};


exports.getOperatorsAndAdmins = (req, res) => {
  User.find({ disabled: false })
    .or([{ occupation: 'operator' }, { occupation: 'admin' }])
    .then(users => res.json(users))
    .catch(err => {
      console.log('getOperators ERROR', err);
      return res.status(404).json(err);
    });
};


exports.addMaterialToDisinfector = (req, res) => {
  User.findById(req.body.object.disinfector)
    .then(user => {
      req.body.object.materials.forEach(mat => {
        user.materials.forEach(item => {
          if (item.material === mat.material && item.unit === mat.unit) {
            item.amount += Number(mat.amount);
            return;
          }
        });
      });
      user.save();
    });

  CurrentMaterial.findOne()
    .then(currentMaterials => {
      currentMaterials.materials.forEach(item => {
        req.body.object.materials.forEach(element => {
          if (item.material === element.material && item.unit === element.unit) {
            item.amount -= element.amount;
            return;
          }
        });
      });
      currentMaterials.save();
    });

  const newObject = new AddMaterial({
    disinfector: req.body.object.disinfector,
    admin: req.body.object.admin,
    materials: req.body.object.materials,
    createdAt: new Date()
  });

  newObject.save()
    .then(obj => res.json(obj))
    .catch(err => {
      console.log('addMaterialToDisinfector ERROR', err);
      return res.status(400).json(err);
    });
};



exports.addMaterialEvents = (req, res) => {
  let timeObject;
  if (req.body.object.type === 'month') {
    timeObject = monthHelper(req.body.object.month, req.body.object.year);
  } else if (req.body.object.type === 'week') {
    timeObject = weekHelper(req.body.object.days);
  } else if (req.body.object.type === 'day') {
    timeObject = dayHelper(req.body.object.day);
  }

  AddMaterial.find({
    $and: [
      { createdAt: { '$gte': timeObject.min } },
      { createdAt: { '$lt': timeObject.max } }
    ]
  })
    // .populate('disinfector admin')
    .populate({
      path: 'disinfector',
      select: 'name occupation'
    })
    .populate({
      path: 'admin',
      select: 'name occupation'
    })
    .exec()
    .then(events => res.json(events))
    .catch(err => {
      console.log('addMaterialEvents ERROR', err);
      res.status(404).json(err);
    });
};


exports.getCurMat = (req, res) => {
  CurrentMaterial.findOne()
    .then(curMat => res.json(curMat))
    .catch(err => {
      console.log('getCurMat ERROR', err);
      res.status(404).json(err);
    });
};


exports.addMatComing = (req, res) => {
  const { object } = req.body;

  const newObject = new ComingMaterial({
    admin: object.admin,
    materials: object.materials,
    createdAt: new Date()
  });

  newObject.save();

  CurrentMaterial.findOne()
    .then(curMat => {
      let array = curMat.materials;

      object.materials.forEach(item => {
        array.forEach(element => {
          if (item.material === element.material && item.unit === element.unit) {
            element.amount += item.amount;
            return;
          }
        });
      });
      curMat.materials = array;
      curMat.lastUpdated = new Date();
      curMat.save();
      return res.json(curMat);
    })
    .catch(err => {
      console.log('addMatComing ERROR', err);
      res.status(400).json(err);
    });
};


exports.getMaterialComingEvents = (req, res) => {
  let timeObject;
  if (req.body.object.type === 'month') {
    timeObject = monthHelper(req.body.object.month, req.body.object.year);
  } else if (req.body.object.type === 'week') {
    timeObject = weekHelper(req.body.object.days);
  } else if (req.body.object.type === 'day') {
    timeObject = dayHelper(req.body.object.day);
  }

  ComingMaterial.find({
    $and: [
      { createdAt: { '$gte': timeObject.min } },
      { createdAt: { '$lt': timeObject.max } }
    ]
  })
    // .populate('admin')
    .populate({
      path: 'admin',
      select: 'name occupation'
    })
    .exec()
    .then(comings => res.json(comings))
    .catch(err => {
      console.log('getMaterialComingEvents ERROR', err);
      res.status(404).json(err);
    });
};


exports.addClient = (req, res) => {
  let errors = {};

  if (req.body.object.type === 'corporate') {
    // case insensitive search
    Client.findOne({ name: new RegExp(`^${req.body.object.name}$`, 'i') })
      .then(client => {
        if (client) {
          errors.name = 'Корпоративный Клиент с таким именем уже существует';
          return res.status(400).json(errors);
        } else {
          const newClient = new Client({
            _id: mongoose.Types.ObjectId(),
            type: req.body.object.type,
            name: req.body.object.name,
            inn: req.body.object.inn,
            orders: [],
            createdAt: req.body.object.createdAt
          });
          return newClient.save();
        }
      })
      .then(savedClient => res.json(savedClient))
      .catch(err => {
        console.log('addClient ERROR', err);
        res.status(400).json(err);
      });

  } else if (req.body.object.type === 'individual') {
    Client.findOne({ phone: req.body.object.phone })
      .then(client => {
        if (client) {
          errors.phone = 'Физический Клиент с таким номером уже существует';
          return res.status(400).json(errors);
        } else {
          const newClient = new Client({
            _id: mongoose.Types.ObjectId(),
            type: req.body.object.type,
            name: req.body.object.name,
            phone: req.body.object.phone,
            address: req.body.object.address,
            orders: [],
            createdAt: req.body.object.createdAt
          });
          return newClient.save();
        }
      })
      .then(savedClient => res.json(savedClient))
      .catch(err => {
        console.log('addClient ERROR', err);
        res.status(400).json(err);
      });
  }
};


exports.editClient = (req, res) => {
  const { object } = req.body;
  Client.findById(object.id)
    .then(client => {
      client.name = object.name;

      if (object.type === 'corporate') {
        client.inn = object.inn;

      } else if (object.type === 'individual') {
        client.address = object.address;
        client.phone = object.phone;
      }

      return client.save();
    })
    .then(editedClient => res.json(editedClient))
    .catch(err => {
      console.log('editClient ERROR', err);
      res.status(404).json(err);
    });
};


exports.changeContractNumbers = (req, res) => {
  const { id, method, contract } = req.body.object;

  Client.findById(id)
    .then(client => {
      let contractsArray = [...client.contracts];

      if (method === 'add') {
        contractsArray.push(contract);

      } else if (method === 'delete') {
        contractsArray = contractsArray.filter(item => item !== contract);
      }

      client.contracts = contractsArray;
      return client.save();
    })
    .then(editedClient => res.json(editedClient))
    .catch(err => {
      console.log('changeContractNumbers ERROR', err);
      res.status(404).json(err);
    });
};


exports.searchClients = async (req, res) => {
  let query;

  // do not load these fields
  const searchObject = {
    orders: 0,
    contracts: 0,
    createdAt: 0
  };

  if (req.body.object.method === 'phone') {
    query = Client.find({
      type: "individual",
      $or: [
        { "phone": req.body.object.payload },
        { "phone": { "$regex": req.body.object.payload, "$options": "i" } }
      ]
    }, searchObject);

  } else if (req.body.object.method === 'inn') {
    query = Client.find({
      type: "corporate",
      $or: [
        { "inn": req.body.object.payload },
        { "inn": { "$regex": req.body.object.payload, "$options": "i" } }
      ]
    }, searchObject);

  } else if (req.body.object.method === 'address') {
    query = Client.find({
      type: "individual",
      $or: [
        { "address": req.body.object.payload },
        { "address": { "$regex": req.body.object.payload, "$options": "i" } }
      ]
    }, searchObject);

  } else if (req.body.object.method === 'name') {

    query = Client.find({
      $or: [
        { "name": req.body.object.payload },
        { "name": { "$regex": req.body.object.payload, "$options": "i" } }
      ]
    }, searchObject);

  } else if (req.body.object.method === 'corporate') {
    query = Client.find({
      type: "corporate"
    }, searchObject);

  } else {
    // } else if (req.body.object.method === 'all') {
    query = Client.find();
  }

  try {
    let clients = await query || [];

    return res.json(clients);
  } catch (err) {
    console.log('searchClients ERROR', err);
    res.status(404).json(err);
  }
};


exports.clientById = async (req, res) => {
  let populateOrders = false;

  // check the amount of orders to populate
  let testClient = await Client.findById(req.body.id);

  if (testClient.orders && testClient.orders.length < 200) {
    populateOrders = true;
  }

  let query;

  try {
    if (populateOrders) {
      query = Client.findById(req.body.id)
        .populate({
          path: 'orders',
          model: 'Order'
        });
    } else {
      query = Client.findById(req.body.id);
    }

    let clientToSend = await query;

    // delete empty orders that cannot be populated
    clientToSend.orders = clientToSend.orders.filter(item => !isEmpty(item));

    return res.json(clientToSend);
  } catch (err) {
    console.log('clientById ERROR', err);
    res.status(404).json(err);
  };
};


exports.getOrdersOfClient = async (req, res) => {
  let timeObject;
  if (req.body.object.type === 'month') {
    timeObject = monthHelper(req.body.object.month, req.body.object.year);
  } else if (req.body.object.type === 'week') {
    timeObject = weekHelper(req.body.object.days);
  } else if (req.body.object.type === 'day') {
    timeObject = dayHelper(req.body.object.day);
  }

  let query;
  if (req.body.object.client.type === 'corporate') {
    query = Order.find({
      clientType: 'corporate',
      clientId: req.body.object.client.id,
      $and: [
        { dateFrom: { '$gte': timeObject.min } },
        { dateFrom: { '$lt': timeObject.max } }
      ]
    })
      .populate('disinfectorId clientId disinfectors.user')
      .exec();

  } else if (req.body.object.client.type === 'individual') {
    query = Order.find({
      clientType: 'individual',
      $or: [
        { "phone": req.body.object.client.phone },
        { "phone": { "$regex": req.body.object.client.phone, "$options": "i" } }
      ],
      $and: [
        { dateFrom: { '$gte': timeObject.min } },
        { dateFrom: { '$lt': timeObject.max } }
      ]
    })
      .populate('disinfectorId clientId disinfectors.user')
      .exec();

  }

  let orders = await query;

  return res.json(orders);
};


exports.addNewMaterial = (req, res) => {
  const newMat = {
    material: req.body.object.material,
    amount: 0,
    unit: req.body.object.unit
  };

  // add material to current materials list
  CurrentMaterial.findOne()
    .then(curMat => {
      let materials = [...curMat.materials];

      materials.push(newMat);
      curMat.materials = [...materials];
      curMat.save();
    });


  // add new material to users
  User.find()
    .then(users => {
      let array;
      users.forEach(user => {

        array = [...user.materials];
        array.push(newMat);

        user.materials = [...array];
        user.save();
      });
    });

  return res.json(newMat);
};