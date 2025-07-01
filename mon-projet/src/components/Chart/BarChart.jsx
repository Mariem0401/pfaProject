import { Bar } from 'react-chartjs-2';
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

const BarChart = ({ data }) => {
  // Palette de couleurs variées
  const backgroundColors = [
    'rgba(255, 99, 132, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)'
  ];

  const chartData = {
    // Suppression des labels pour cacher les noms de produits
    labels: data?.products.map(() => '') || [], 
    datasets: [{
      label: 'Ventes',
      data: data?.sales || [],
      backgroundColor: backgroundColors,
      borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
      borderWidth: 1,
      // Arrondi des coins des barres
      borderRadius: 4
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false // Cache la légende
      },
      title: {
        display: true,
        text: 'Répartition des ventes',
        font: {
          size: 16
        }
      },
      // Configuration du tooltip pour afficher le nom du produit
      tooltip: {
        callbacks: {
          title: (context) => {
            return data?.products[context[0].dataIndex] || 'Produit';
          }
        }
      }
    },
    scales: {
      x: {
        // Désactive complètement l'axe X
        display: false
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;