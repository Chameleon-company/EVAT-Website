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
    const options = {
            responsive: true,
            aspectRatio: 0.75,
            plugins: {
              legend: { display: false },
              title: { display: true, text: props.title, color: "#FFFFFF", font: {
                size: 16
              } },
            },
            scales: {
              x: {
                ticks: {
                  color: "#FFFFFF"
                },
                grid: {
                  color: "#acaaaa"
                }
              },
              y: {
                ticks: {
                  color: "#FFFFFF"
                },
                grid: {
                  color: "#acaaaa"
                }
              }
            }
    };

    return (<Bar data={props.data} options={options}/>);
};

export default BarChart;