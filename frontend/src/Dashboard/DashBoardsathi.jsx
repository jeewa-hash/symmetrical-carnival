import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DashBoardsathi.css';

import BR1 from '../image/BR.png';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement // Import the PointElement
} from 'chart.js';

// Register the necessary components and scales
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement);

const Dashboard = () => {
    const [completedDeliveries, setCompletedDeliveries] = useState(0);
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        const fetchCompletedDeliveries = async () => {
            try {
                const response = await axios.get('/api/Report/list');
                const completedDeliveries = response.data.filter((report) => report.delivery_Status === 'Completed');
                setCompletedDeliveries(completedDeliveries.length);
            } catch (error) {
                console.error('Error fetching completed deliveries count', error);
            }
        };

        fetchCompletedDeliveries();
    }, []);

    // Fetch the delivery reports from the backend
    const fetchReports = async () => {
        try {
            const response = await axios.get('/api/Report/list');
            const data = response.data; // Correctly access the data
            setReportData(data);
        } catch (error) {
            console.error("Error fetching reports", error);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // Process the data for the chart
    const processData = () => {
        const statusCounts = {
            Pending: 0,
            Inprogress: 0,
            Delivered: 0,
            Cancelled: 0,
            Failed: 0,
            Completed: 0
        };

        reportData.forEach(report => {
            if (statusCounts[report.delivery_Status] !== undefined) {
                statusCounts[report.delivery_Status]++;
            }
        });

        const labels = Object.keys(statusCounts);
        const data = Object.values(statusCounts);

        return { labels, data };
    };

    const chartData = processData();

    // Chart configuration for the bar chart and line chart
    const barChartData = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Delivery Status Count',
                data: chartData.data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            }
        ]
    };

    const lineChartData = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Delivery Status Count Over Time',
                data: chartData.data,
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }
        ]
    };

    return (
        <div className='bg-cover min-h-screen bg-no-repeat' style={{backgroundImage: `url(${BR1})`}}>
            
            <div className='dashboard-container'>
                <center>
                    <div className='dashboard-card'>
                        <h3>Completed Deliveries</h3>
                        <div className='completed-deliveries-number'>{completedDeliveries}</div>
                    </div>
                </center>
                <div>
                    <h2>Delivery Status Bar Chart</h2>
                    {/* Set width and height for the Bar chart */}
                    <Bar data={barChartData} options={{ responsive: true }} width={800} height={400} />
                </div>
                <div>
                    <h2>Delivery Status Line Chart</h2>
                    {/* Set width and height for the Line chart */}
                    <Line data={lineChartData} options={{ responsive: true }} width={800} height={400} />
                </div>
            </div>
          
        </div>
    );
};

export default Dashboard;
