const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const materials = require('../client/src/components/common/materials');

// Load Input Validation
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

exports.registerUser = async (req, res) => {
  let { errors, isValid } = validateRegisterInput(req.body);

  let existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) {
    errors.email = 'Email already exists';
    isValid = false;
  }

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  let emptyArray = [];
  materials.forEach(item => {
    emptyArray.push({
      material: item.material,
      amount: 0,
      unit: item.unit
    });
  });

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    occupation: req.body.occupation,
    color: req.body.color,
    password: req.body.password,
    materials: emptyArray
  });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser
        .save()
        .then(user => res.json(user))
        .catch(err => console.log('registerUser ERROR', err));
    });
  });
};


exports.loginUser = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email: email, disabled: false }).then(user => {
    // Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched

        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          occupation: user.occupation,
          materials: user.materials,
          color: user.color,

          // CHANGED
          birthday: user.birthday,
          married: user.married,
          hasChildren: user.hasChildren,
          children: user.children
        };

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          // { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token,
              user: payload
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
};


// @desc    Return current user
exports.currentUser = (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    occupation: req.user.occupation,
    materials: req.user.materials,
    color: req.user.color,

    // CHANGED
    birthday: req.user.birthday,
    married: req.user.married,
    hasChildren: req.user.hasChildren,
    children: req.user.children
  });
};


exports.changePassword = (req, res) => {
  User.findById(req.body.object.userId)
    .then(user => {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.object.password1, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          return user.save();
        });
      });
    })
    .then(user => res.json(user))
    .catch(err => {
      console.log('changePassword ERROR', err);
      return res.status(404).json(err);
    });
};


exports.getUserById = (req, res) => {
  User.findById(req.body.userId)
    .then(user => res.json(user))
    .catch(err => {
      console.log('getUserById ERROR', err);
      return res.status(404).json(err);
    });
};


exports.editUser = (req, res) => {
  User.findById(req.body.object.userId)
    .then(user => {
      user.name = req.body.object.name;
      user.email = req.body.object.email;
      user.phone = req.body.object.phone;
      user.occupation = req.body.object.occupation;
      user.color = req.body.object.color;
      user.birthday = new Date(req.body.object.birthday);
      user.married = req.body.object.married;
      user.hasChildren = req.body.object.hasChildren;
      user.children = req.body.object.children;
      return user.save();
    })
    .then(savedUser => res.json(savedUser))
    .catch(err => {
      console.log('editUser ERROR', err);
      return res.status(404).json(err);
    });
};


exports.disableUser = (req, res) => {
  const { id } = req.body.object;
  User.findById(id)
    .then(user => {
      user.disabled = true;
      return user.save();
    })
    .then(disabledUser => res.json(disabledUser))
    .catch(err => {
      console.log('disableUser ERROR', err);
      return res.status(404).json(err);
    });
};


exports.getDisinfectorMaterials = (req, res) => {
  User.findById(req.body.id)
    .then(disinfector => res.json(disinfector.materials))
    .catch(err => {
      console.log('getDisinfectorMaterials ERROR', err);
      return res.status(404).json(err);
    });
};