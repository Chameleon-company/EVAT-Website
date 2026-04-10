import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = (props) => {
    console.log(props.title);
    const options = {
            responsive: true,
            plugins: {
            legend: { position: 'top' },
            title: { display: true, text: props.title },
        },
    };

    if (!options) return <div>Loading...</div>;
    return (<Bar data={props.data} options={options}/>);
};

export default BarChart;