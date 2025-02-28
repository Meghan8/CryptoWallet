import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import '../styles/WalletChart.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WalletChart = ({ walletData }) => {
  console.log("WalletChart rendering with data:", walletData);
  
  // Ensure we have data with positive values
  const validAssets = walletData.filter(asset => 
    asset && asset.value && parseFloat(asset.value) > 0 && asset.symbol
  );
  
  console.log("Valid assets for chart:", validAssets);

  // Calculate total portfolio value
  const totalValue = validAssets.reduce((total, asset) => 
    total + parseFloat(asset.value || 0), 0);

  // Generate a distinct color for each asset
  const generateColors = (count) => {
    const baseColors = [
      '#3861fb', // Blue
      '#16c784', // Green
      '#f7931a', // Bitcoin orange
      '#627eea', // Ethereum blue
      '#e84142', // Red
      '#8c8c8c', // Gray
      '#2775ca', // USDC blue
      '#26a17b', // Tether green
      '#f0b90b', // Binance yellow
      '#1a1f36', // Dark blue
    ];
    
    // If we have more assets than base colors, generate additional colors
    const colors = [...baseColors];
    
    if (count > baseColors.length) {
      for (let i = baseColors.length; i < count; i++) {
        const hue = (i * 137) % 360; // Golden angle approximation for nice distribution
        colors.push(`hsl(${hue}, 70%, 60%)`);
      }
    }
    
    return colors.slice(0, count);
  };

  // Sort assets by value (highest first)
  const sortedAssets = [...validAssets].sort((a, b) => 
    parseFloat(b.value || 0) - parseFloat(a.value || 0)
  );

  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Prepare data for the horizontal bar chart
  const chartData = {
    labels: sortedAssets.map(asset => asset.symbol),
    datasets: [
      {
        label: 'Asset Value',
        data: sortedAssets.map(asset => parseFloat(asset.value || 0)),
        backgroundColor: generateColors(sortedAssets.length),
        borderWidth: 1,
      }
    ]
  };

  // Chart options
  const options = {
    indexAxis: 'y', // Horizontal bar chart
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend since we have labels on the bars
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = ((value / totalValue) * 100).toFixed(1);
            return `${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };

  // If no valid assets, show a message
  if (validAssets.length === 0) {
    return (
      <div className="wallet-chart">
        <h3>Portfolio Distribution</h3>
        <div className="no-chart-data">No portfolio data available</div>
      </div>
    );
  }

  return (
    <div className="wallet-chart">
      <h3>Portfolio Distribution</h3>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
      
      {/* Add an additional text summary below the chart */}
      <div className="portfolio-summary">
        {sortedAssets.map((asset, index) => {
          const percentage = ((parseFloat(asset.value) / totalValue) * 100).toFixed(1);
          return (
            <div key={asset.id} className="portfolio-item">
              <div className="portfolio-item-color" style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}></div>
              <div className="portfolio-item-symbol">{asset.symbol}</div>
              <div className="portfolio-item-value">{formatCurrency(asset.value)}</div>
              <div className="portfolio-item-percentage">{percentage}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WalletChart;