import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';
import reportWebVitals from './reportWebVitals';

// The previous site. It only loads on /?classic (see index.tsx), so take the
// "under construction" page out of the way before rendering.
document.getElementById('holding')?.remove();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
