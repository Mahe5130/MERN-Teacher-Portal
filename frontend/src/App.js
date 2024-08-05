import './App.css';
import Dashboard from './components/Dashboard';
import LoginForm from './components/Login';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <div className="container">
      {/* <LoginForm /> */}
      {/* <Todo/> */}
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginForm/>}>  </Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
