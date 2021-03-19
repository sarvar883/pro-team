const Order = require('../models/order');
const AddMaterial = require('../models/addMaterial');

const yearHelper = require('../utils/yearMinMax');
const monthHelper = require('../utils/monthMinMax');
const weekHelper = require('../utils/weekMinMax');
const dayHelper = require('../utils/dayMinMax');


exports.disinfectorGetsHisOwnStats = async (req, res) => {
  const { id } = req.body.object;

  let timeObject;
  if (req.body.object.type === 'month') {
    timeObject = monthHelper(req.body.object.month, req.body.object.year);
  } else if (req.body.object.type === 'week') {
    timeObject = weekHelper(req.body.object.days);
  } else if (req.body.object.type === 'day') {
    timeObject = dayHelper(req.body.object.day);
  }

  let acceptedOrders = [];

  let addedMaterials = await AddMaterial.find({
    disinfector: id,
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
    .exec();

  Order.find({
    $and: [
      { dateFrom: { '$gte': timeObject.min } },
      { dateFrom: { '$lt': timeObject.max } }
    ],
    $or: [
      { disinfectorId: id },
      { "disinfectors.user": id },
      { userAcceptedOrder: id }
    ]
  })
    // .populate('userAcceptedOrder disinfectors.user')
    .populate({
      path: 'userAcceptedOrder',
      select: 'name occupation'
    })
    .populate({
      path: 'disinfectors.user',
      select: 'name occupation'
    })
    .exec()
    .then(orders => {

      acceptedOrders = orders.filter(item =>
        item.userAcceptedOrder &&
        item.userAcceptedOrder._id.toString() === id
      );

      orders = orders.filter(item => {
        let amongDisinfectors = 0;
        item.disinfectors.forEach(element => {
          if (element.user._id.toString() === id) amongDisinfectors++;
        });
        if (item.disinfectorId._id.toString() === id || amongDisinfectors > 0) {
          return true;
        } else {
          return false;
        }
      });

      return res.json({
        orders: orders,
        acceptedOrders: acceptedOrders,
        addedMaterials: addedMaterials
      });
    })
    .catch(err => {
      console.log('disinfectorGetsHisOwnStats ERROR', err);
      res.status(404).json(err);
    });
};


exports.genStatsForAdmin = (req, res) => {
  // общая статистика
  let timeObject;
  if (req.body.object.type === 'month') {
    timeObject = monthHelper(req.body.object.month, req.body.object.year);
  } else if (req.body.object.type === 'week') {
    timeObject = weekHelper(req.body.object.days);
  } else if (req.body.object.type === 'day') {
    timeObject = dayHelper(req.body.object.day);
  }

  Order.find({
    $and: [
      { dateFrom: { '$gte': timeObject.min } },
      { dateFrom: { '$lt': timeObject.max } }
    ]
  })
    .populate({
      path: 'disinfectorId',
      select: 'name occupation'
    })
    .populate({
      path: 'clientId',
      select: 'name'
    })
    .populate({
      path: 'disinfectors.user',
      select: 'name occupation'
    })
    .exec()
    .then(orders => res.json(orders))
    .catch(err => {
      console.log('genStatsForAdmin ERROR', err);
      res.status(404).json(err);
    });
};


exports.disinfectorStatsForAdmin = (req, res) => {
  let { id } = req.body.object;

  let timeObject;
  if (req.body.object.type === 'month') {
    timeObject = monthHelper(req.body.object.month, req.body.object.year);
  } else if (req.body.object.type === 'week') {
    timeObject = weekHelper(req.body.object.days);
  } else if (req.body.object.type === 'day') {
    timeObject = dayHelper(req.body.object.day);
  }

  let acceptedOrders = [];

  Order.find({
    $and: [
      { dateFrom: { '$gte': timeObject.min } },
      { dateFrom: { '$lt': timeObject.max } }
    ],
    $or: [
      { disinfectorId: id },
      { "disinfectors.user": id },
      { userAcceptedOrder: id }
    ]
  })
    .populate({
      path: 'clientId',
      select: 'name'
    })
    .populate({
      path: 'disinfectors.user',
      select: 'name occupation'
    })
    .exec()
    .then(orders => {
      acceptedOrders = orders.filter(item =>
        item.userAcceptedOrder &&
        item.userAcceptedOrder._id.toString() === id
      );

      orders = orders.filter(item => {

        let amongDisinfectors = 0;
        item.disinfectors.forEach(element => {
          if (element.user._id.toString() === id) amongDisinfectors++;
        });
        if (item.disinfectorId._id.toString() === id || amongDisinfectors > 0) {
          return true;
        } else {
          return false;
        }
      });

      return res.json({
        disinfectorId: id,
        orders,
        acceptedOrders
      });
    })
    .catch(err => {
      console.log('disinfectorStatsForAdmin ERROR', err);
      res.status(404).json(err);
    });
};


exports.getAdvStats = (req, res) => {
  let timeObject;
  if (req.body.object.type === 'month') {
    timeObject = monthHelper(req.body.object.month, req.body.object.year);
  } else if (req.body.object.type === 'year') {
    timeObject = yearHelper(req.body.object.year);
  }

  Order.find({
    $and: [
      { dateFrom: { '$gte': timeObject.min } },
      { dateFrom: { '$lt': timeObject.max } }
    ]
  }, {
    clientType: 1,
    completed: 1,
    failed: 1,
    advertising: 1,
    operatorDecided: 1,
    operatorConfirmed: 1,
    accountantDecided: 1,
    accountantConfirmed: 1,
    adminDecided: 1,
    adminConfirmed: 1,
    cost: 1,
    score: 1
  })
    .then(orders => res.json(orders))
    .catch(err => {
      console.log('getAdvStats ERROR', err);
      res.status(404).json(err);
    });
};


exports.getOperatorStats = (req, res) => {
  let timeObject;
  if (req.body.object.type === 'month') {
    timeObject = monthHelper(req.body.object.month, req.body.object.year);
  } else if (req.body.object.type === 'week') {
    timeObject = weekHelper(req.body.object.days);
  } else if (req.body.object.type === 'day') {
    timeObject = dayHelper(req.body.object.day);
  }

  Order.find({
    userAcceptedOrder: req.body.object.operatorId,
    $and: [
      { dateFrom: { '$gte': timeObject.min } },
      { dateFrom: { '$lt': timeObject.max } }
    ]
  })
    .populate({
      path: 'disinfectorId',
      select: 'name occupation'
    })
    .populate({
      path: 'clientId',
      select: 'name'
    })
    .populate({
      path: 'disinfectors.user',
      select: 'name occupation'
    })
    .exec()
    .then(orders => {
      return res.json({
        method: req.body.object.type,
        sortedOrders: orders
      });
    })
    .catch(err => {
      console.log('getOperatorStats ERROR', err);
      res.status(404).json(err);
    });
};



exports.getUserMatComing = (req, res) => {
  let timeObject;
  if (req.body.object.type === 'month') {
    timeObject = monthHelper(req.body.object.month, req.body.object.year);
  } else if (req.body.object.type === 'week') {
    timeObject = weekHelper(req.body.object.days);
  }

  AddMaterial.find({
    disinfector: req.body.object.userId,
    $and: [
      { createdAt: { '$gte': timeObject.min } },
      { createdAt: { '$lt': timeObject.max } }
    ]
  })
    .populate({
      path: 'admin',
      select: 'name occupation'
    })
    .exec()
    .then(objects => res.json(objects))
    .catch(err => {
      console.log('getUserMatComing ERROR', err);
      res.status(404).json(err);
    });
};


exports.getUserMatDistrib = (req, res) => {
  let timeObject;
  if (req.body.object.type === 'month') {
    timeObject = monthHelper(req.body.object.month, req.body.object.year);
  } else if (req.body.object.type === 'week') {
    timeObject = weekHelper(req.body.object.days);
  }

  AddMaterial.find({
    admin: req.body.object.userId,
    $and: [
      { createdAt: { '$gte': timeObject.min } },
      { createdAt: { '$lt': timeObject.max } }
    ]
  })
    .populate({
      path: 'disinfector',
      select: 'name occupation'
    })
    .exec()
    .then(objects => res.json(objects))
    .catch(err => {
      console.log('getUserMatDistrib ERROR', err);
      res.status(404).json(err);
    });
};