import logo from '../logo.svg';
import React, {useContext} from 'react';
import Dashboard from './dashboard/dashboard'
import DashRedirect from './dashboard/dashRedirect';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import bookingInfo from './booking/bookingInfo'
import CreateService from './service/createService'
import EditService from './service/editService'
import SignUpScreen from './authentication/SignUpScreen'
import LoginScreen from './authentication/LoginScreen'
import {UserContext} from "../providers/UserProvider";
import {Spin} from "antd";



export default function Application() {
  const user = useContext(UserContext);
  console.log("USER");
  console.log(user);
  if(user==="not loaded"){
    return(<Spin/>)
  }

  return (
      user ? 
      <Router>
        <div className="App">
        <Route path="/" component={DashRedirect} />
        <Route path="/bookingInfo" component={bookingInfo} />
        <Route path="/newService" component={CreateService} />
        <Route path="/editService" component={EditService} />
        <Route path="/dashboard" component={Dashboard} />
        </div>
      </Router>
      :
      <Router>
          <Switch>
            <Route path="/" component={LoginScreen}/>
          </Switch>
        </Router>
  );
}