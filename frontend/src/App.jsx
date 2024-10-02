import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// Importing components
import OrderManagementSystem from './OrderManagement/order';
import ProductionManagementSystem from './ProductionManagement/productionPlaning';
import ResourcePlanningSystem from './ProductionManagement/ResourcesPlaning';
import OrderAndProduction from './OrderAndProductionUi/OrderAndProduction';
import OrderAndProductionReport from './OrderandProductionReport/OrderandProductionReport';
import ProductionCostCalculator from './ProductionManagement/productionCost';
import OrderRet from './OrderManagement/orderRet';
import ProductionRet from './ProductionManagement/ProductionRet';
import ResourceRetriew from './ProductionManagement/ResourceRet';
import AboutUs from './OrderAndProductionUi/AboutUs';

const App = () => {
  return (
    <Router>
      
      <div>
        <AboutUs/>
        <Routes>
          
          <Route path="/" element={<OrderAndProduction />} />
          <Route path="/order" element={<OrderManagementSystem />} />
          <Route path="/production" element={<ProductionManagementSystem />} />
          <Route path="/resources" element={<ResourcePlanningSystem />} />
          <Route path="/report" element={<OrderAndProductionReport />} /> {/* Add this route */}
          <Route path="/cost" element={<ProductionCostCalculator/>} />
          <Route path="/orderret" element={<OrderRet/>} />
          <Route path="/productret" element={<ProductionRet/>} />
         <Route path="/Resourcetret" element={<ResourceRetriew/>} />
        
        </Routes>
        
      </div>
     
    </Router>
  );
};

export default App;
