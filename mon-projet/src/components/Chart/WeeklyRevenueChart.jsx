import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';

function WeeklyRevenueChart() {
  const [data, setData] = useState({ categories: [], series: [] });

  useEffect(() => {
    axios.get('http://localhost:5000/api/stats/weekly-revenue')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  const chartOptions = {
    chart: {
      id: 'weekly-revenue',
      toolbar: { show: false }
    },
    xaxis: {
      categories: data.categories
    }
  };

  const chartSeries = [
    {
      name: 'Revenu',
      data: data.series
    }
  ];

  return (
    <div className="w-full">
      <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
    </div>
  );
}

export default WeeklyRevenueChart;
