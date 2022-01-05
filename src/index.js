import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css';



// store.subscribe(()=>{
//   console.log(
//     "Stor Changed"
// ,
// store.getState()
//   )
// })

// store.dispatch({
//     type:"REQUESTED_DOG",
//       payload :{
//           url:"http://www.google.com"
//       }
//   })
//   console.log(store.getState());



// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

ReactDOM.render(
    <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
