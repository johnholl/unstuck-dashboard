import logo from './logo.svg';
// import './App.css';
import Dashboard from './components/dashboard/dashboard'
import 'antd/dist/antd.css';
import { BrowserRouter as Router} from "react-router-dom";


function App() {
  return (
      <Router>
        <div className="App">
            <Dashboard/>
        </div>
      </Router>
  );
}

export default App;
