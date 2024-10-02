import React from 'react';
import './Interface.css';
import { Link } from 'react-router-dom';


const ButtonGroup = () => {
  return (
    <div className="button-container">
        <Link to='/rawMaterials'>
      <button className="custom-button">
         RAW MATERIALS
        </button>
    </Link>
      
      <Link to='/FinishedGoods'>
      <button className="custom-button">
        FINISH GOODS
    </button>
    </Link>
    
    <Link to='/SupplierRequestForm'>
      <button className="custom-button">
        REQUEST REPORTS
    </button>
    </Link>

    <Link to='/Valuation'>
    <button className="custom-button">
        VALUATION REPORT
    </button>
    </Link>
    </div>
  );
}

export default ButtonGroup;
