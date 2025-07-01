import React from 'react';
import { Bar } from 'react-chartjs-2';
import { FiActivity } from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserActivityChart = ({ userStats, loading }) => {
  // Transformation des données de l'API
  const chartData = {
    labels: ['Total', 'Actifs', 'Nouveaux'],
    datasets: [{
      label: 'Utilisateurs',
      data: [
        userStats?.totalUsers || 0,
        userStats?.activeUsers || 0,
        userStats?.newUsers || 0
      ],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)', // Total - bleu
        'rgba(75, 192, 192, 0.7)',  // Actifs - vert
        'rgba(255, 159, 64, 0.7)'   // Nouveaux - orange
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1,
      borderRadius: 4
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}`
        }
      }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow h-80">
      <h3 className="font-medium text-gray-700 mb-4 flex items-center">
        <FiActivity className="mr-2" />
        Statistiques Utilisateurs
      </h3>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default UserActivityChart;