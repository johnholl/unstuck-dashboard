import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Spin } from 'antd';
import { UserContext } from '../providers/UserProvider';
import Dashboard from './dashboard/dashboard';
// import DashRedirect from './dashboard/dashRedirect';
import bookingInfo from './booking/bookingInfo';
import CreateService from './service/createService';
import EditService from './service/editService';
import LoginScreen from './authentication/LoginScreen';
import SignUpScreen from './authentication/SignUpScreen';
import '../App.less';

export default function Application() {
  const user = useContext(UserContext).user;
  if (user === 'not loaded') {
    return <Spin />;
  }

  return user ? (
    <Router>
      <div className="App">
      {/* <Route path="/" component={DashRedirect} /> */}
        <Route path="/bookingInfo" component={bookingInfo} />
        <Route path="/newService" component={CreateService} />
        <Route path="/editService" component={EditService} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/signup" component={SignUpScreen} />

      </div>
    </Router>
  ) : (
    <Router>
      <Switch>
        <Route path="/login" component={LoginScreen} />
        <Route path="/signup" component={SignUpScreen} />
      </Switch>
    </Router>
  );
}
