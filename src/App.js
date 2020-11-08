import logo from './logo.svg';
// import './App.css';
import Dashboard from './components/dashboard/dashboard'
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Route} from "react-router-dom";
import bookingInfo from './components/booking/bookingInfo'
import CreateService from './components/service/createService'
import EditService from './components/service/editService'


function App() {

  return (
      <Router>
        <div className="App">
        <Route path="/bookingInfo" component={bookingInfo} />
        <Route path="/newService" component={CreateService} />
        <Route path="/editService" component={EditService} />
        <Route path="/dashboard" component={Dashboard} />
        </div>
      </Router>
  );
}

export default App;
