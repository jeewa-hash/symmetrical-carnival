import React from 'react';
import Financeuserinterface from './financehandling/financeuserinterface';
import Salarycalculateinterface from './financehandling/salarycalculateinterface';
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import Orderbillinterface from './financehandling/orderbillinterface';
import Home from './Home/Home';
//import Login from './Login/login';
//import Registration from './Registration/Registration';
import Salaryret from './financehandling/salaryret';
import Financereport from './financehandling/financereport';



const App = () => {
  return (
    <Router>
      <Home />
       
       <Financereport/>
        <Salaryret />
        
      <div>
        
      <Routes>
          <Route exact path="/" element={<Financeuserinterface />} />
          <Route path="/salarycalculateinterface" element={<Salarycalculateinterface />} />
          <Route path="/orderbillinterface" element={<Orderbillinterface />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
