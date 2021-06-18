const User = require('../models/user');
const Order = require('../models/order');
const AddMaterial = require('../models/addMaterial');


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
      console.log('getSortedOrders SUBADMIN ERROR', err);
      return res.status(400).json(err);
    });
};


// exports.getAllDisinfectors = (req, res) => {
//   User.find({ occupation: 'disinfector', disabled: false })
//     .then(disinfectors => res.json(disinfectors))
//     .catch(err => {
//       console.log('getAllDisinfectors SUBADMIN ERROR', err);
//       return res.status(400).json(err);
//     });
// };


exports.getSubadminMaterials = (req, res) => {
  User.findById(req.body.id)
    .then(user => res.json(user))
    .catch(err => {
      console.log('getSubadminMaterials ERROR', err);
      return res.status(400).json(err);
    });
};


// subadmin adds material to disinfector
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

  User.findById(req.body.object.subadmin)
    .then(subadmin => {
      subadmin.materials.forEach(item => {
        req.body.object.materials.forEach(mat => {
          if (item.material === mat.material && item.unit === mat.unit) {
            item.amount -= mat.amount;
            return;
          }
        });
      });
      subadmin.save();
    });

  const newObject = new AddMaterial({
    disinfector: req.body.object.disinfector,
    admin: req.body.object.subadmin,
    materials: req.body.object.materials,
    createdAt: new Date()
  });

  newObject.save()
    .then(obj => res.json(obj))
    .catch(err => {
      console.log('addMaterialToDisinfector SUBADMIN ERROR', err);
      return res.status(400).json(err);
    });
};


exports.getMatComHistory = (req, res) => {
  let timeObject;
  if (req.body.object.type === 'month') {
    timeObject = monthHelper(req.body.object.month, req.body.object.year);
  } else if (req.body.object.type === 'week') {
    timeObject = weekHelper(req.body.object.days);
  }

  AddMaterial.find({
    disinfector: req.body.object.subadmin,
    $and: [
      { createdAt: { '$gte': timeObject.min } },
      { createdAt: { '$lt': timeObject.max } }
    ]
  })
    .populate('admin disinfector')
    .exec()
    .then(events => {
      return res.json({
        method: req.body.object.type,
        events: events
      });
    })
    .catch(err => {
      console.log('getMatComHistory SUBADMIN ERROR', err);
      return res.status(400).json(err);
    });
};


exports.getMatDistribHistory = (req, res) => {
  let timeObject;
  if (req.body.object.type === 'month') {
    timeObject = monthHelper(req.body.object.month, req.body.object.year);
  } else if (req.body.object.type === 'week') {
    timeObject = weekHelper(req.body.object.days);
  }

  AddMaterial.find({
    admin: req.body.object.subadmin,
    $and: [
      { createdAt: { '$gte': timeObject.min } },
      { createdAt: { '$lt': timeObject.max } }
    ]
  })
    .populate('admin disinfector')
    .exec()
    .then(events => {
      return res.json({
        method: req.body.object.type,
        events: events
      });
    })
    .catch(err => {
      console.log('getMatDistribHistory SUBADMIN ERROR', err);
      return res.status(400).json(err);
    });
};