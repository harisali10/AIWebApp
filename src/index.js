import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import "primereact/resources/primereact.min.css";
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

ReactDOM.render(
  <BrowserRouter>
    {/* <App /> */}
    <AppRoutes ></AppRoutes>
  </BrowserRouter>
  // <BrowserRouter><App /></BrowserRouter>
  ,
  document.getElementById('root')
);

reportWebVitals();
