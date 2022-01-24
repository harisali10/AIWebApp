import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "primereact/resources/primereact.min.css";
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { createStore } from "redux";
import { Provider } from 'react-redux';
import  appReducer  from './store/reducer/index'; 

const store = createStore(appReducer);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <AppRoutes ></AppRoutes>
    </BrowserRouter>
   </Provider>
  ,
  document.getElementById('root')
);

reportWebVitals();
