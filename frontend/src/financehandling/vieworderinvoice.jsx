import React from 'react';

const Vieworderinvoice = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white w-full max-w-2xl mx-4 p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-semibold">Order Invoice</h2>
          <button className="text-gray-500 hover:text-red-500" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="mb-6">
          <p className="text-lg font-bold">Shop Details</p>
          <p className="text-gray-700"><strong>Shop Name:</strong> {order.shopName}</p>
          <p className="text-gray-700"><strong>Shop Address:</strong> {order.shopAddress}</p>
          <p className="text-gray-700"><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
          <p className="text-gray-700"><strong>Total Amount:</strong> Rs.{order.totalAmount.toFixed(2)}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-3">Ordered Items</h3>
          <div className="grid grid-cols-4 font-semibold text-gray-800 border-b py-2">
            <div>Item</div>
            <div>Quantity</div>
            <div className="text-right">Price</div>
            <div className="text-right">Total Price</div>
          </div>
          <ul>
            {order.orderItems.map((item, index) => (
              <li key={index} className="grid grid-cols-4 border-b py-2 text-gray-600">
                <div>{item.name}</div>
                <div>{item.quantity}</div>
                <div className="text-right">Rs.{item.price.toFixed(2)}</div>
                <div className="text-right">Rs.{(item.quantity * item.price).toFixed(2)}</div> {/* Total price */}
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-4 py-4 text-lg font-bold text-gray-800">
            <div></div>
            <div></div>
            <div>Total:</div>
            <div className="text-right">Rs.{order.totalAmount.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Vieworderinvoice;
