import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';

import { Provider } from 'react-redux';
import store from './store';

// import routes
import StartPage from './components/common/StartPage';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import SubadminRoute from './components/common/SubadminRoute'
import OperatorRoute from './components/common/OperatorRoute';
import AccountantRoute from './components/common/AccountantRoute';
import DisinfectorRoute from './components/common/DisinfectorRoute';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Admin from './components/admin/Admin';
import AdminStats from './components/admin/AdminStats';
import AdvStats from './components/admin/AdvStats';
import DisStats from './components/admin/DisStats';
import OperStats from './components/admin/OperStats';
import AdminQueries from './components/admin/AdminQueries';
import AdminMaterials from './components/admin/AdminMaterials';
import EditOrder from './components/common/EditOrder';
import MatComing from './components/admin/MatComing';
import MatComHistory from './components/admin/MatComHistory';
import MaterialHistory from './components/admin/MaterialHistory';
import AddClient from './components/admin/AddClient';
import EditClient from './components/common/EditClient';
import Users from './components/common/Users';
import EditUser from './components/common/EditUser';
import ClientList from './components/admin/ClientList';
import ClientId from './components/admin/ClientId';
import SetDisinfectorMaterials from './components/common/SetDisinfectorMaterials';
import SetCurrentMaterials from './components/admin/SetCurrentMaterials';

import NewMaterial from './components/common/NewMaterial';

import Subadmin from './components/subadmin/Subadmin';
import SubadmOrders from './components/subadmin/SubadmOrders';
// import SubOrderForm from './components/subadmin/SubOrderForm';
import MaterialDistrib from './components/subadmin/MaterialDistrib';
import SubMatComHist from './components/subadmin/SubMatComHist';
import MatDistribHistory from './components/subadmin/MatDistribHistory';

import Disinfector from './components/disinfector/Disinfector';
import DisinfQueries from './components/disinfector/DisinfQueries';
import DisinfStats from './components/disinfector/DisinfStats';
import OrderComplete from './components/disinfector/OrderComplete';
import DisMaterials from './components/disinfector/DisMaterials';
import DisMatCom from './components/disinfector/DisMatCom';
import DisMatDistrib from './components/disinfector/DisMatDistrib';
import ReturnedQueries from "./components/disinfector/ReturnedQueries";

import Operator from './components/operator/Operator';
import CreateOrder from './components/operator/CreateOrder';
import OrderDetails from './components/operator/OrderDetails';
import OrderQueries from './components/operator/OrderQueries';
import ConfirmOrder from './components/operator/ConfirmOrder';
import RepeatOrders from './components/operator/RepeatOrders';
import CreateRepeatOrder from './components/operator/CreateRepeatOrder';
import OperatorStats from './components/operator/OperatorStats';

import Accountant from './components/accountant/Accountant';
import Queries from './components/accountant/Queries';
import ConfirmQueryForm from './components/accountant/ConfirmQueryForm';
import AccStats from './components/accountant/AccStats';

import OrderFullDetails from './components/common/OrderFullDetails';
import NotCompOrders from './components/operator/NotCompOrders';
import SearchOrders from './components/operator/SearchOrders';
import Chat from './components/chat/Chat';
import ChatRoom from './components/chat/ChatRoom';
import Anons from './components/chat/Anons';

import Register from './components/auth/Register';
import Login from './components/auth/Login';

// Fail Order Components
import FailAddNew from './components/fail/FailAddNew';
import SeeFails from './components/fail/SeeFails';

// CSS
import './App.css';
import './darkTheme.css';


// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current Profile
    store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = '/login';
  }
}


class App extends Component {
  state = {
    theme: localStorage.getItem('proTeamTheme') || 'light'
  };

  componentDidMount() {
    store.subscribe(() => {
      this.setState({
        theme: store.getState().options.theme
      });
    });
  };

  render() {
    if (this.state.theme === 'dark') {
      document.body.style.background = '#212d3b';
    } else {
      document.body.style.background = 'white';
    }

    return (
      <Provider store={store}>
        <Router>
          <div className={`App ${this.state.theme}`}>
            {/* <div className="App"> */}
            <Navbar />
            <Route exact path="/login" component={Login} />

            <Switch>
              <StartPage exact path="/" />
            </Switch>

            <Switch>
              <PrivateRoute exact path="/anons" component={Anons} />
            </Switch>

            <Switch>
              <PrivateRoute exact path="/not-completed-orders" component={NotCompOrders} />
            </Switch>

            <Switch>
              <PrivateRoute exact path="/order-full-details/:id" component={OrderFullDetails} />
            </Switch>


            {/* Admin Routes */}
            <Switch>
              <AdminRoute exact path="/admin" component={Admin} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/register" component={Register} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/admin/stats" component={AdminStats} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/admin/adv-stats" component={AdvStats} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/admin/disinf-stats" component={DisStats} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/admin/operator-stats" component={OperStats} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/admin/order-queries" component={AdminQueries} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/admin/materials" component={AdminMaterials} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/admin/material-coming" component={MatComing} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/admin/material-coming-history" component={MatComHistory} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/admin/material-history" component={MaterialHistory} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/edit-order/:orderId" component={EditOrder} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/admin/users" component={Users} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/admin/edit-user/:userId" component={EditUser} />
            </Switch>

            <Switch>
              {/* <AdminRoute exact path="/admin/add-client" component={AddClient} /> */}
              <PrivateRoute exact path="/add-client" component={AddClient} />
            </Switch>

            <Switch>
              <PrivateRoute exact path="/edit-client/:id" component={EditClient} />
            </Switch>

            <Switch>
              <PrivateRoute exact path="/clients" component={ClientList} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/client/:clientId" component={ClientId} />
            </Switch>


            <Switch>
              <AdminRoute exact path="/admin/new/mat" component={NewMaterial} />
            </Switch>

            <Switch>
              <AdminRoute exact path="/admin/set-disinfector-materials/:id" component={SetDisinfectorMaterials} />
            </Switch>
            <Switch>
              <AdminRoute exact path="/admin/set-current-materials" component={SetCurrentMaterials} />
            </Switch>


            {/* Subadmin Routes */}
            <Switch>
              <SubadminRoute exact path="/subadmin" component={Subadmin} />
            </Switch>
            <Switch>
              <SubadminRoute exact path="/subadmin/orders" component={SubadmOrders} />
            </Switch>
            <Switch>
              <SubadminRoute exact path="/subadmin/queries" component={DisinfQueries} />
            </Switch>
            <Switch>
              <SubadminRoute exact path="/subadmin/stats" component={DisinfStats} />
            </Switch>
            {/* <Switch>
              <SubadminRoute exact path="/subadmin/order-complete-form/:id" component={SubOrderForm} />
            </Switch> */}
            <Switch>
              <SubadminRoute exact path="/subadmin/materials" component={MaterialDistrib} />
            </Switch>
            <Switch>
              <SubadminRoute exact path="/subadmin/material-coming-history" component={SubMatComHist} />
            </Switch>
            <Switch>
              <SubadminRoute exact path="/subadmin/material-distrib-history" component={MatDistribHistory} />
            </Switch>


            {/* DisinfectorRoutes */}
            <Switch>
              <DisinfectorRoute exact path="/disinfector" component={Disinfector} />
            </Switch>
            <Switch>
              {/* <DisinfectorRoute exact path="/order-complete-form/:id" component={OrderComplete} /> */}
              <PrivateRoute exact path="/order-complete-form/:id" component={OrderComplete} />
            </Switch>
            <Switch>
              <DisinfectorRoute exact path="/disinfector/queries" component={DisinfQueries} />
            </Switch>
            <Switch>
              <DisinfectorRoute exact path="/disinfector/stats" component={DisinfStats} />
            </Switch>
            <Switch>
              <DisinfectorRoute exact path="/disinfector/distrib-materials" component={DisMaterials} />
            </Switch>
            <Switch>
              <DisinfectorRoute exact path="/disinfector/mat-com-history" component={DisMatCom} />
            </Switch>
            <Switch>
              <DisinfectorRoute exact path="/disinfector/mat-distrib-history" component={DisMatDistrib} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/returned-queries" component={ReturnedQueries} />
            </Switch>


            {/* OperatorRoutes */}
            <Switch>
              <OperatorRoute exact path="/operator" component={Operator} />
            </Switch>
            <Switch>
              <OperatorRoute exact path="/create-order" component={CreateOrder} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/order-details/:id" component={OrderDetails} />
            </Switch>
            <Switch>
              <OperatorRoute exact path="/operator/order-queries" component={OrderQueries} />
            </Switch>
            <Switch>
              <OperatorRoute exact path="/order-confirm/:id" component={ConfirmOrder} />
            </Switch>
            <Switch>
              <OperatorRoute exact path="/operator/repeat-orders" component={RepeatOrders} />
            </Switch>
            <Switch>
              <OperatorRoute exact path="/create-repeat-order-form/:orderId" component={CreateRepeatOrder} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/search-orders" component={SearchOrders} />
            </Switch>
            <Switch>
              <OperatorRoute exact path="/operator/stats" component={OperatorStats} />
            </Switch>


            {/* Accountant Routes */}
            <Switch>
              <AccountantRoute exact path="/accountant" component={Accountant} />
            </Switch>
            <Switch>
              <AccountantRoute exact path="/accountant/queries" component={Queries} />
            </Switch>
            <Switch>
              <AccountantRoute exact path="/accountant/order-confirm/:id" component={ConfirmQueryForm} />
            </Switch>
            <Switch>
              <AccountantRoute exact path="/accountant/stats" component={AccStats} />
            </Switch>


            {/* Fail Order Routes */}
            <Switch>
              <PrivateRoute exact path="/fail/add-new/:id" component={FailAddNew} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/fail/see" component={SeeFails} />
            </Switch>


            {/* Chat Routes */}
            <Switch>
              <PrivateRoute exact path="/chat" component={Chat} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/chat/:chatId" component={ChatRoom} />
            </Switch>

            {/* Footer */}
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;