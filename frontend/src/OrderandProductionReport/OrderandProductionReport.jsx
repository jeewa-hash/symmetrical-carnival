import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProductionList = () => {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [batchDateQueries, setBatchDateQueries] = useState({});

  useEffect(() => {
    const fetchProductions = async () => {
      try {
        const response = await axios.get('/api/products');
        setProductions(response.data);
      } catch (err) {
        setError('Failed to fetch productions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductions();
  }, []);

  const groupByBatch = (productions) => {
    return productions.reduce((acc, production) => {
      (acc[production.batch] = acc[production.batch] || []).push(production);
      return acc;
    }, {});
  };

  const handleBatchDateChange = (date) => {
    setBatchDateQueries((prev) => ({
      ...prev,
      date,
    }));
  };

  const filterProductions = (productions, query, dateQuery) => {
    return productions.filter((production) => {
      const matchesNameOrId =
        production.name.toLowerCase().includes(query.toLowerCase()) ||
        production._id.toLowerCase().includes(query.toLowerCase());

      const matchesDate = dateQuery ? production.productionDate === dateQuery : true;

      return matchesNameOrId && matchesDate;
    });
  };

  const filteredProductions = filterProductions(productions, searchQuery, batchDateQueries.date);
  const groupedProductions = groupByBatch(filteredProductions);

  // Aggregate data per batch for daily, monthly, and yearly reports
  const aggregateProductionDataByBatch = (productions) => {
    const batchAggregates = {};

    Object.entries(groupedProductions).forEach(([batch, batchProductions]) => {
      const dailyData = {};
      const monthlyData = {};
      const yearlyData = {};

      batchProductions.forEach(production => {
        const date = new Date(production.productionDate);
        const day = date.toLocaleDateString();
        const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        const year = date.getFullYear();

        dailyData[day] = (dailyData[day] || 0) + production.quantity;
        monthlyData[month] = (monthlyData[month] || 0) + production.quantity;
        yearlyData[year] = (yearlyData[year] || 0) + production.quantity;
      });

      batchAggregates[batch] = { dailyData, monthlyData, yearlyData };
    });

    return batchAggregates;
  };

  const batchAggregates = aggregateProductionDataByBatch(filteredProductions);

  // Prepare chart data for each batch separately
  const prepareChartData = (data, type) => {
    const dataset = {
      labels: [],
      datasets: []
    };

    Object.entries(data).forEach(([batch, batchData]) => {
      const entries = type === 'daily' ? batchData.dailyData : type === 'monthly' ? batchData.monthlyData : batchData.yearlyData;

      const batchLabels = Object.keys(entries);
      const batchValues = Object.values(entries);

      dataset.labels = batchLabels; // Assuming all batches will have the same labels
      dataset.datasets.push({
        label: batch,
        data: batchValues,
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
      });
    });

    return dataset;
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const dailyChartData = prepareChartData(batchAggregates, 'daily');
  const monthlyChartData = prepareChartData(batchAggregates, 'monthly');
  const yearlyChartData = prepareChartData(batchAggregates, 'yearly');

  return (
    <div className="bg-pink-50 min-h-screen">
      
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold mb-6 text-center text-purple-600">Production Data</h2>

        {/* Charts */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-center text-pink-600">Production Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-center text-pink-600">Daily</h4>
              <Bar data={dailyChartData} options={{ responsive: true }} />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-center text-pink-600">Monthly</h4>
              <Bar data={monthlyChartData} options={{ responsive: true }} />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-center text-pink-600">Yearly</h4>
              <Bar data={yearlyChartData} options={{ responsive: true }} />
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ProductionList;