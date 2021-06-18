const Order = require('../models/order');


const monthHelper = require('../utils/monthMinMax');
const weekHelper = require('../utils/weekMinMax');
const dayHelper = require('../utils/dayMinMax');


const validateConfirmedOrder = require('../validation/confirmOrder');


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
    // Order.find()
    .populate('disinfectorId clientId')
    .exec()
    .then(orders => res.json(orders))
    .catch(err => {
      console.log('getSortedOrders ERROR', err);
      return res.status(400).json(err);
    });
};


exports.getNotCompOrders = (req, res) => {
  Order.find({
    completed: false,
    dateFrom: { '$lt': new Date() }
  }, {
    disinfectorId: 1,
    clientId: 1,
    clientType: 1,
    client: 1,
    dateFrom: 1,
    phone: 1,
    phone2: 1,
    address: 1,
    typeOfService: 1,
  })
    // .populate('disinfectorId clientId')
    .populate({
      path: 'disinfectorId',
      select: 'name occupation'
    })
    .populate({
      path: 'clientId',
      select: 'name'
    })
    .exec()
    .then(orders => res.json(orders))
    .catch(err => {
      console.log('getNotCompOrders ERROR', err);
      return res.status(400).json(err);
    });
};


exports.getCompleteOrders = (req, res) => {
  const operatorId = req.body.id;

  Order.find({
    completed: true,
    operatorDecided: false
  })
    // .populate('disinfectorId clientId userCreated userAcceptedOrder')
    .populate({
      path: 'disinfectorId',
      select: 'name occupation'
    })
    .populate({
      path: 'clientId',
      select: 'name'
    })
    // .populate({
    //   path: 'userCreated',
    //   select: 'name occupation'
    // })
    // .populate({
    //   path: 'userAcceptedOrder',
    //   select: 'name occupation'
    // })
    .exec()
    .then(completeOrders => res.json(completeOrders))
    .catch(err => {
      console.log('getCompleteOrders ERROR', err);
      return res.status(400).json(err);
    });
};


exports.getCompleteOrderById = (req, res) => {
  Order.findById(req.params.id)
    .populate('disinfectorId userCreated clientId userAcceptedOrder disinfectors.user')
    .populate({
      // populate field 'nextOrdersAfterFailArray' and field 'disinfectorId' inside it
      path: 'nextOrdersAfterFailArray',
      model: 'Order',
      // select only 2 fields
      select: 'dateFrom disinfectorId',
      populate: {
        path: 'disinfectorId',
        model: 'User',
        select: 'occupation name'
      }
    })
    .exec()
    .then(order => res.json(order))
    .catch(err => {
      console.log('getCompleteOrderById ERROR', err);
      return res.status(404).json(err);
    });
};


exports.confirmCompleteOrder = (req, res) => {
  if (req.body.object.decision === 'confirm') {
    const { errors, isValid } = validateConfirmedOrder(req.body.object);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
  }

  Order
    .findById(req.body.object.orderId)
    .then(foundOrder => {
      foundOrder.operatorDecided = true;
      foundOrder.operatorCheckedAt = new Date();

      if (req.body.object.decision === 'confirm') {
        foundOrder.operatorConfirmed = true;
        foundOrder.clientReview = req.body.object.clientReview;
        foundOrder.score = req.body.object.score;
      } else if (req.body.object.decision === 'reject') {
        foundOrder.operatorConfirmed = false;
      }
      return foundOrder.save();
    })
    .then(confirmedOrder => res.json(confirmedOrder))
    .catch(err => {
      console.log('confirmCompleteOrder ERROR', err);
      return res.status(400).json(err);
    });
};


exports.getRepeatOrders = (req, res) => {
  let timeObject;
  if (req.body.object.type === 'month') {
    timeObject = monthHelper(req.body.object.month, req.body.object.year);
  } else if (req.body.object.type === 'week') {
    timeObject = weekHelper(req.body.object.days);
  } else if (req.body.object.type === 'day') {
    timeObject = dayHelper(req.body.object.day);
  }

  // We should keep only ongoing repeated orders
  Order.find({
    repeatedOrder: true,
    repeatedOrderDecided: false,
    $and: [
      { timeOfRepeat: { '$gte': timeObject.min } },
      { timeOfRepeat: { '$lt': timeObject.max } }
    ]
  })
    // .populate('disinfectors.user disinfectorId clientId userCreated userAcceptedOrder')
    .populate({
      path: 'disinfectors.user',
      select: 'name occupation'
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
      path: 'userCreated',
      select: 'name occupation'
    })
    .populate({
      path: 'userAcceptedOrder',
      select: 'name occupation'
    })
    .populate({
      path: 'previousOrder',
      model: 'Order',
      populate: {
        path: 'disinfectors.user',
        select: 'name occupation',
        model: 'User'
      }
    })
    .exec()
    .then(orders => {
      // some orders seem to have previousOrder of null. Possibly this is because the previous order is created and later deleted. In order to avoid bugs we filter out orders which have previousOrder field equal to null
      orders = orders.filter(item => item.previousOrder !== null);

      orders = orders.sort((a, b) => new Date(a.timeOfRepeat) - new Date(b.timeOfRepeat));

      return res.json(orders);
    })
    .catch(err => {
      console.log('getRepeatOrders ERROR', err);
      return res.status(400).json(err);
    });
};


exports.repeatOrderForm = (req, res) => {
  Order.findById(req.body.id)
    .populate('previousOrder disinfectorId clientId userCreated userAcceptedOrder')
    .exec()
    .then(order => res.json(order))
    .catch(err => {
      console.log('repeatOrderForm ERROR', err);
      return res.status(400).json(err);
    });
};


exports.repeatOrderNotNeeded = (req, res) => {
  Order.findById(req.body.id)
    .then(order => {
      order.repeatedOrderDecided = true;
      order.repeatedOrderNeeded = false;
      return order.save();
    })
    .then(savedOrder => res.json(savedOrder))
    .catch(err => {
      console.log('repeatOrderNotNeeded ERROR', err);
      return res.status(400).json(err);
    });
};


// operator sees his own statistics
exports.getOperatorStats = (req, res) => {
  let timeObject;
  if (req.body.object.type === 'month') {
    timeObject = monthHelper(req.body.object.month, req.body.object.year);
  } else if (req.body.object.type === 'week') {
    timeObject = weekHelper(req.body.object.days);
  } else if (req.body.object.type === 'day') {
    timeObject = dayHelper(req.body.object.day);
  }

  // Order.find({ userAcceptedOrder: req.body.object.operatorId })
  Order.find({
    userAcceptedOrder: req.body.object.operatorId,
    $and: [
      { dateFrom: { '$gte': timeObject.min } },
      { dateFrom: { '$lt': timeObject.max } }
    ]
  })
    // .populate('disinfectorId clientId userCreated userAcceptedOrder disinfectors.user')
    .populate({
      path: 'disinfectorId',
      select: 'name occupation'
    })
    .populate({
      path: 'clientId',
      select: 'name'
    })
    .populate({
      path: 'userCreated',
      select: 'name occupation'
    })
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