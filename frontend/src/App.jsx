import React from 'react';
import Financeuserinterface from './financehandling/financeuserinterface';
import Salarycalculateinterface from './financehandling/salarycalculateinterface';
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import Orderbillinterface from './financehandling/orderbillinterface';
import Home from './Home/Home';
//import Login from './Login/login';
//import Registration from './Registration/Registration';
import Salaryret from './financehandling/salaryret';
//import Financereport from './financehandling/financereport';
//import About from './aboutus/about';
import OrderAndProduction from './OrderAndProductionUi/OrderAndProduction';
import HRInterface from './HRManagementInterface/HRInterface';
import Financereport from './financehandling/financereport';

const App = () => {
  return (
    <Router>
     <div>
        <Routes>
          
          <Route exact path="/" element={<Financeuserinterface />} />
          <Route path="/orderandproductionui" element={<OrderAndProduction />} />
          <Route path="/financeui" element={<Financeuserinterface />} />
          <Route path="orderbillinterface" element={<Orderbillinterface />} />
          <Route path="/salaryret" element={<Salaryret />} />
          <Route path="/financereport" element={<Financereport />} />
            
            
    
          <Route path="/Hrui" element={<HRInterface />} />
          <Route path="/salarycalculateinterface" element={<Salarycalculateinterface />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
