import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const PulseRateChart = () => {
  const [data, setData] = useState({
    labels: [0],
    datasets: [
      {
        data: [90],
        borderColor: 'rgb(166, 87, 226)',
        backgroundColor: 'rgb(236, 217, 249)',
        borderWidth: 4,
        fill: true,
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = Math.floor(Math.random() * (100 - 90 + 1)) + 90;

      setData((prevData) => {
        const newData = [...prevData.datasets[0].data, newValue];
        const newLabels = [...prevData.labels, prevData.labels.length * 5];

        return {
          labels: newLabels,
          datasets: [
            {
              ...prevData.datasets[0],
              data: newData,
            },
          ],
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,  // This will ensure width:height = 2:1
    animation: { duration: 0 },
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'linear',
        title: { display: true, text: 'Time (seconds)' },
        min: 0,
        max: (data.labels.length - 1) * 5,
        ticks: {
          stepSize: Math.max(5, Math.ceil((data.labels.length - 1) / 10) * 5),
          callback: (value) => value.toFixed(0),
        },
      },
      y: {
        title: { display: true, text: 'temperature' },
        min: 90,
        max: 100,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div style={{width: '370px', margin: '0 auto'}}>
      <Line data={data} options={chartOptions} />
    </div>
  );
};

export default PulseRateChart;