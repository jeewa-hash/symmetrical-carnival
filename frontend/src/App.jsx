import React from 'react';

const App = () => {
  return (
    <Router>
      <Home />
       
       <Financereport/>
        <Salaryret />
        <About/>
      <div>
        
      <Routes>
          <Route exact path="/" element={<Financeuserinterface />} />
          <Route path="/salarycalculateinterface" element={<Salarycalculateinterface />} />
          <Route path="/orderbillinterface" element={<Orderbillinterface />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
