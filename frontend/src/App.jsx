import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importing components
import OrderManagementSystem from './OrderManagement/order';
import ProductionManagementSystem from './ProductionManagement/productionPlaning';
import ResourcePlanningSystem from './ProductionManagement/ResourcesPlaning';
import OrderAndProduction from './OrderAndProductionUi/OrderAndProduction';
import OrderAndProductionReport from './OrderandProductionReport/OrderandProductionReport';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<OrderAndProduction />} />
          <Route path="/order" element={<OrderManagementSystem />} />
          <Route path="/production" element={<ProductionManagementSystem />} />
          <Route path="/resources" element={<ResourcePlanningSystem />} />
          <Route path="/report" element={<OrderAndProductionReport />} /> {/* Add this route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
