import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { clearCurrentProfile } from '../../actions/profileActions';
import { setTheme } from '../../actions/optionsActions';

class Navbar extends Component {
  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser(this.props.history);
  }

  changeTheme = (theme) => {
    this.props.setTheme(theme);
  };


  // fullRefresh = () => {
  //   window.location.reload(true);
  // };

  render() {
    const { isAuthenticated, user } = this.props.auth;

    // const showRefreshButtton = (
    //   <li className="nav-item">
    //     <button className="btn btn-grey nav-link" onClick={() => this.fullRefresh()}>Обновить Pro Team</button>
    //   </li>
    // );

    const authLinks = (
      <div className="authLinks">
        {/* <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Чат</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link to="/chat" className="nav-link">Чат</Link>
            </li>
            <li className="nav-item">
              <Link to="/anons" className="nav-link">Анонсы</Link>
            </li>
          </div>
        </div> */}


        <li className="nav-item list-inline-item">
          <Link to="/login" onClick={this.onLogoutClick} className="nav-link logout">
            <i className="fas fa-sign-out-alt"></i> Logout
          </Link>
        </li>
      </div>
    );


    const guestLinks = (
      <div className="guestLinks">
        <li className="nav-item list-inline-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </div>
    );


    const disinfectorLinks = (
      <div className="disinfectorLinks">

        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Функции</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/disinfector/stats">Статистика</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/disinfector/queries">Запросы</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/returned-queries">Возвращенные Запросы</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/fail/see">Некач. и Повт. Заказы</Link>
            </li>
            {/* {showRefreshButtton} */}
          </div>
        </div>

        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Материалы</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/disinfector/distrib-materials">Раздать пользователям</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/disinfector/mat-com-history">Ваши приходы</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/disinfector/mat-distrib-history">Ваши раздачи</Link>
            </li>
          </div>
        </div>
      </div>
    );


    const operatorLinks = (
      <div className="operatorLinks">
        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Стат.</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/operator/stats">Статистика</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/fail/see">Некач. и Повт. Заказы</Link>
            </li>
          </div>
        </div>

        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Функции</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/operator/order-queries">Запросы</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/clients">Клиенты</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/operator/repeat-orders">Повторные продажи</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/not-completed-orders">Невып. Заказы</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search-orders">Поиск заказов</Link>
            </li>
            {/* {showRefreshButtton} */}
          </div>
        </div>

        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Добавить</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/create-order">Заказ</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add-client">Клиента</Link>
            </li>
          </div>
        </div>
      </div>
    );


    const accountantLinks = (
      <div className="accountantLinks">
        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Стат.</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/accountant/stats">Статистика</Link>
            </li>
          </div>
        </div>

        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Функции</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/accountant/queries">Запросы</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/clients">Клиенты</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search-orders">Поиск заказов</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/fail/see">Некач. и Повт. Заказы</Link>
            </li>
            {/* {showRefreshButtton} */}
          </div>
        </div>
      </div>
    );


    const subadminLinks = (
      <div className="subadminLinks">
        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Стат.</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/subadmin/stats">Ваша Стат.</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/stats">Общая Стат.</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/disinf-stats">Стат. Дезинфекторов</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/operator-stats">Стат. Оператора / Админа</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/adv-stats">Стат. Рекламы</Link>
            </li>
          </div>
        </div>

        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Функции</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/subadmin/orders">Ваши Заказы</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/subadmin/queries">Запросы</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/returned-queries">Возвращенные Запросы</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search-orders">Поиск заказов</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/clients">Клиенты</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/fail/see">Некач. и Повт. Заказы</Link>
            </li>
            {/* {showRefreshButtton} */}
          </div>
        </div>

        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Материалы</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/subadmin/material-coming-history">Приходы</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/subadmin/material-distrib-history">Раздачи</Link>
            </li>
          </div>
        </div>

        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Добавить</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/subadmin/materials">Материалы Дезинфектору</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add-client">Клиента</Link>
            </li>
          </div>
        </div>
      </div>
    );


    const adminLinks = (
      <div className="adminLinks">

        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Стат.</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/stats">Общая Статистика</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/disinf-stats">Статистика Дезинфекторов</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/operator-stats">Стат. Оператора / Админа</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/adv-stats">Статистика Рекламы</Link>
            </li>
          </div>
        </div>

        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Функции</button>
          <div className="dropdown-menu">
            {/* <li className="nav-item">
              <Link className="nav-link" to="/admin/order-queries">Запросы</Link>
            </li> */}
            <li className="nav-item">
              <Link className="nav-link" to="/clients">Клиенты</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/fail/see">Некач. и Повт. Заказы</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/not-completed-orders">Невып. Заказы</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search-orders">Поиск заказов</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/users">Пользователи</Link>
            </li>
            {/* {showRefreshButtton} */}
          </div>
        </div>

        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Материалы</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/material-coming-history">Приходы</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/material-history">Раздачи</Link>
            </li>
          </div>
        </div>

        <div className="dropdown">
          <button type="button" className="btn btn-primary dropdown-toggle align-baseline mr-2" data-toggle="dropdown">Добавить</button>
          <div className="dropdown-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/material-coming">Приход Материалов</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/materials">Материалы Пользователю</Link>
            </li>
            <li className="nav-item">
              {/* <Link className="nav-link" to="/admin/add-client">Клиента</Link> */}
              <Link className="nav-link" to="/add-client">Клиента</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">Новый Пользователь</Link>
            </li>
          </div>
        </div>
      </div>
    );


    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary pt-0 pb-0" id="navbar">
        <div className="container pt-2 pb-2 pl-0 pr-0">
          <Link to={`/${user.occupation}`} className="navbar-brand p-2">ProDez</Link>

          {this.props.options.theme === 'light' ? (
            <button className="navbar-brand" onClick={() => this.changeTheme('dark')}><i className="fas fa-moon"></i></button>
          ) : (
            <button className="navbar-brand" onClick={() => this.changeTheme('light')}><i className="fas fa-sun"></i></button>
          )}

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarCollapse">
            <img src="../img/hamburger.svg" className="hamburger" alt="Hamburger" />
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav ml-auto list-inline">
              {user.occupation === 'admin' ? adminLinks : ('')}
              {user.occupation === 'subadmin' ? subadminLinks : ('')}
              {user.occupation === 'accountant' ? accountantLinks : ('')}
              {user.occupation === 'operator' ? operatorLinks : ('')}
              {user.occupation === 'disinfector' ? disinfectorLinks : ('')}
              {isAuthenticated ? authLinks : guestLinks}
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  options: state.options
});

export default connect(mapStateToProps, { logoutUser, clearCurrentProfile, setTheme })(withRouter(Navbar));