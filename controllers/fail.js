const mongoose = require('mongoose');
const User = require('../models/user');
const Order = require('../models/order');
const Client = require('../models/client');

const monthHelper = require('../utils/monthMinMax');
const weekHelper = require('../utils/weekMinMax');
const dayHelper = require('../utils/dayMinMax');


exports.createNewAfterFail = async (req, res) => {
  const { userOccupation, failedOrder, newOrder } = req.body.object;

  // console.log('prev', failedOrder);

  try {
    // create new order
    let newOrderAfterFail = {
      _id: mongoose.Types.ObjectId(),

      // newOrderFields
      disinfectorId: newOrder.disinfectorId,
      dateFrom: newOrder.dateFrom,
      typeOfService: newOrder.typeOfService,
      comment: newOrder.comment,
      userCreated: newOrder.userCreated,

      // fields from previous failed order
      clientType: failedOrder.clientType,
      client: failedOrder.client,
      address: failedOrder.address,
      phone: failedOrder.phone,
      phone2: failedOrder.phone2,
      advertising: failedOrder.advertising,
      userAcceptedOrder: failedOrder.userAcceptedOrder._id,
      prevFailedOrder: failedOrder._id,

      // defaults
      disinfectorComment: '',
      repeatedOrder: false
    };
    if (failedOrder.clientType === 'corporate') {
      newOrderAfterFail.clientId = failedOrder.clientId._id;
    }

    // console.log('server', newOrderAfterFail);


    // find failed order
    const previousfailedOrder = await Order.findById(failedOrder._id);

    previousfailedOrder.failed = true;
    // previousfailedOrder.nextOrderAfterFail = newOrderAfterFail._id;

    // повторные заказы после некачественного заказа (массив)
    let nextOrders = [...previousfailedOrder.nextOrdersAfterFailArray];
    nextOrders.push(newOrderAfterFail._id);
    previousfailedOrder.nextOrdersAfterFailArray = nextOrders;


    if (userOccupation === 'operator') {
      previousfailedOrder.operatorDecided = true;
      previousfailedOrder.operatorConfirmed = false;
      previousfailedOrder.operatorCheckedAt = new Date();

    } else if (userOccupation === 'admin') {
      previousfailedOrder.adminDecided = true;
      previousfailedOrder.adminConfirmed = false;
      previousfailedOrder.adminCheckedAt = new Date();

    } else if (userOccupation === 'accountant') {
      previousfailedOrder.accountantDecided = true;
      previousfailedOrder.accountantConfirmed = false;
      previousfailedOrder.accountantCheckedAt = new Date();
    }

    await previousfailedOrder.save();

    const order = new Order(newOrderAfterFail);
    order.save()
      .then((savedOrder) => {
        if (failedOrder.clientType === 'corporate') {
          Client.findById(failedOrder.clientId._id)
            .then(client => {
              client.orders.push(savedOrder._id);
              client.save();
            });

        } else if (failedOrder.clientType === 'individual') {
          Client.findOne({ phone: failedOrder.phone })
            .then(client => {
              if (client) {
                // if we have a client with this phone number
                client.orders.push(savedOrder._id);
                client.save();
              }
            });
        }

        return res.json(savedOrder);
      });
  } catch (err) {
    console.log('createNewAfterFail ERROR', err);
    res.status(400).json(err);
  }
};


// вытащить из БД некачественные и повторные заказы !!
exports.getFailedOrders = (req, res) => {
  let timeObject;
  if (req.body.object.type === 'month') {
    timeObject = monthHelper(req.body.object.month, req.body.object.year);
  } else if (req.body.object.type === 'week') {
    timeObject = weekHelper(req.body.object.days);
  } else if (req.body.object.type === 'day') {
    timeObject = dayHelper(req.body.object.day);
  }

  Order.find({
    completed: true,
    $and: [
      { dateFrom: { '$gte': timeObject.min } },
      { dateFrom: { '$lt': timeObject.max } }
    ],
    $or: [
      // некачественные заказы
      { failed: true },
      // повторные заказы
      { prevFailedOrder: { $exists: true } }
    ],
  })
    // .populate('disinfectorId clientId disinfectors.user')
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

    .populate({
      path: 'prevFailedOrder',
      model: 'Order',
      select: 'dateFrom disinfectorId',
      populate: {
        path: 'disinfectorId',
        model: 'User',
        select: 'occupation name'
      }
    })

    .populate({
      // populate field 'nextOrdersAfterFailArray' and field 'disinfectorId' inside it
      // path: 'nextOrderAfterFail',
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
    .then(failedOrders => {

      // disinfector sees only his failed orders
      // all other users see all failed orders
      if (req.body.object.userOccupation === 'disinfector') {
        failedOrders = failedOrders.filter(item => {
          let amongDisinfectors = 0;
          item.disinfectors.forEach(element => {
            if (element.user._id.toString() === req.body.object.userId) amongDisinfectors++;
          });

          if (
            item.disinfectorId._id.toString() === req.body.object.userId ||
            amongDisinfectors > 0
          ) {
            return true;
          } else {
            return false;
          }
        });
      }

      return res.json(failedOrders);
    })
    .catch(err => {
      console.log('getFailedOrders ERROR', err);
      return res.status(400).json(err);
    });
};