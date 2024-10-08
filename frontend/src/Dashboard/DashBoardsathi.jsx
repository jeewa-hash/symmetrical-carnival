import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DashBoardsathi.css';

const Dashboard = () => {
    const [completedDeliveries, setCompletedDeliveries] = useState(0);

    useEffect(() => {
        const fetchCompletedDeliveries = async () => {
            try {
                const response = await axios.get(' /api/Report/list');
                const completedDeliveries = response.data.filter((report) => report.delivery_Status === 'Completed');
                setCompletedDeliveries(completedDeliveries.length);
            } catch (error) {
                console.error('Error fetching completed deliveries count', error);
            }
        };

        fetchCompletedDeliveries();
    }, []);

    return (
      <div className='dashboard-container'>
        <div className='dashboard-card'>
          <h3>Completed Deliveries</h3>
          <div className='completed-deliveries-number'>{completedDeliveries}</div>
        </div>
      </div>
    );
};

export default Dashboard;
