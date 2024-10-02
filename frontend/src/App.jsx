import React from 'react';
import Header from './Shared/Header';
import Footer from './Shared/Footer';
import Financeuserinterface from './financehandling/financeuserinterface';
import Salarycalculateinterface from './financehandling/salarycalculateinterface';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Orderbillinterface from './financehandling/orderbillinterface';
import Home from './Home/Home';
import Salaryret from './financehandling/salaryret';
import Financereport from './financehandling/financereport';
import FIMainTable from './financehandling/fiMainTable';
import Billorderret from './financehandling/billorderret';
import Salaryupdate from './financehandling/salaryupdate'; 
import RegistrationForm from './Registration/Registration';
import { NotificationProvider } from './notification/notificatioonContext'; // Updated path for Notification Context
import NotificationDropdown from './notification/notifidropdown'; // Updated path for Notification Dropdown

const App = () => {
  return (
    <NotificationProvider> {/* Wrap your app inside the NotificationProvider */}
      <Router>
        <div>
          <Header />
          
          <div>
            {/* Add the NotificationDropdown component to show notifications */}
            <NotificationDropdown />
          </div>
          
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/financeui" element={<Financeuserinterface />} />
              <Route path="/financeui/salarycalculateinterface" element={<Salarycalculateinterface />} />
              <Route path="/financeui/orderbillinterface" element={<Orderbillinterface />} />
              <Route path="/salaryret" element={<Salaryret />} />
              <Route path="/financeui/ftable" element={<FIMainTable />} />
              <Route path="/orders" element={<Billorderret />} />
              <Route path="/salary-update/:employeeId" element={<Salaryupdate />} />
            </Routes>
          </div>
          
          <Footer />
        </div>
      </Router>
    </NotificationProvider>
  );
};

export default App;
