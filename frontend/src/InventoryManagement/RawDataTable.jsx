
import React from 'react';
import './RawDataTable.css';

const RawDataTable = ({ data }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Supplier</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.productName}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
              <td>{item.supplier}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RawDataTable;
