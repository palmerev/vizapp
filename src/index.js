import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const data = [ 35, 200, 150, 50, 100, 85, 225 ]

ReactDOM.render(
  <App data={data} />,
  document.getElementById('root')
);
