const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

// Import security packages
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const chatRoutes = require('./routes/chat');
const operatorRoutes = require('./routes/operator');
const adminRoutes = require('./routes/admin');
const subadminRoutes = require('./routes/subadmin');
const accountantRoutes = require('./routes/accountant');
const statsRoutes = require('./routes/stats');
const failRoutes = require('./routes/fail');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// import and launch telegram bot
// const bot = require('./bot');
// bot.launch();

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('server.js ERROR', err));

// Use security packages
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors());

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use(authRoutes);
app.use('/order', orderRoutes);
app.use('/chat', chatRoutes);
app.use('/operator', operatorRoutes);
app.use('/stats', statsRoutes);
app.use('/admin', adminRoutes);
app.use('/subadmin', subadminRoutes);
app.use('/accountant', accountantRoutes);
app.use('/fail', failRoutes);


// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;
const server = app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
const io = require('./socket').init(server);