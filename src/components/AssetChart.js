import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import '../styles/AssetChart.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

const AssetChart = ({ history, timeframe }) => {
  // Process chart data
  const chartData = useMemo(() => {
    if (!history || history.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            borderColor: '#3861fb',
            backgroundColor: 'rgba(56, 97, 251, 0.1)',
          },
        ],
      };
    }

    // Sort by time ascending
    const sortedHistory = [...history].sort((a, b) => {
      return new Date(a.time) - new Date(b.time);
    });

    // Format date labels based on timeframe
    const labels = sortedHistory.map(item => {
      const date = new Date(item.time);
      
      // Different formats based on timeframe
      switch(timeframe) {
        case 'h1':
          return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          });
        case 'd1':
          return date.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          });
        case 'w1':
          return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
          });
        case 'm1':
          return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
          });
        default:
          return date.toLocaleString('en-US');
      }
    });

    // Get price data
    const prices = sortedHistory.map(item => parseFloat(item.priceUsd));

    // Calculate gradient color based on price trend
    const priceStart = prices[0];
    const priceEnd = prices[prices.length - 1];
    const isPriceUp = priceEnd >= priceStart;
    const borderColor = isPriceUp ? '#16c784' : '#ea3943';
    const backgroundColor = isPriceUp 
      ? 'rgba(22, 199, 132, 0.1)' 
      : 'rgba(234, 57, 67, 0.1)';

    return {
      labels,
      datasets: [
        {
          label: 'Price (USD)',
          data: prices,
          borderColor,
          backgroundColor,
          tension: 0.1,
          fill: true,
          borderWidth: 2,
          pointRadius: 0,
          pointHitRadius: 10,
        },
      ],
    };
  }, [history, timeframe]);

  // Chart options - adjustable based on timeframe
  const options = useMemo(() => {
    // Determine how many ticks to show based on timeframe
    let maxTicksLimit;
    switch(timeframe) {
      case 'h1': maxTicksLimit = 6; break;
      case 'd1': maxTicksLimit = 8; break;
      case 'w1': maxTicksLimit = 7; break;
      case 'm1': maxTicksLimit = 10; break;
      default: maxTicksLimit = 8;
    }

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return `$${context.parsed.y.toFixed(context.parsed.y < 1 ? 6 : 2)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            maxTicksLimit,
            maxRotation: 0,
          },
        },
        y: {
          position: 'right',
          grid: {
            color: 'rgba(200, 200, 200, 0.1)',
          },
          ticks: {
            callback: function(value) {
              // Different formatting based on price range
              if (value >= 1000) {
                return '$' + value.toLocaleString();
              } else if (value >= 1) {
                return '$' + value.toFixed(2);
              } else {
                return '$' + value.toPrecision(4);
              }
            },
          },
        },
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false,
      },
    };
  }, [timeframe]);

  // Render the chart if we have data
  return (
    <div className="chart-container">
      {history && history.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="no-chart-data">No historical data available</div>
      )}
    </div>
  );
};

export default AssetChart;