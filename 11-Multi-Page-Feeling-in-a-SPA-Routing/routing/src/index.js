import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import axios from 'axios';

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';
axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.request.use(
  (request) => {
    console.log('request: ', request);
    // edit the request config before we return it
    return request; // we need to always return the request or the request config otherwise you're blocking the request.
  },
  (error) => {
    console.log('error: ', error);
    // handle the error globally (e.g. we want to log the error in the log file which we send to a server...)
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    console.log('response: ', response);
    // edit the response config before we return it
    return response;
  },
  (error) => {
    console.log('error: ', error);
    // handle the error globally (e.g. we want to log the error in the log file which we send to a server...)
    return Promise.reject(error);
  },
);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
