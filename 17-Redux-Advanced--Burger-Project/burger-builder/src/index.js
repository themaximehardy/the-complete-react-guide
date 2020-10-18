import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'; // 1 – import Provider from react-redux
import { createStore } from 'redux'; // 2 – import createStore from redux

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reducer from './store/reducer'; // 3 – import our reducer

const store = createStore(reducer); // 4 – create our store and pass our reducer

// 5 – wrap BrowserRouter with Provider (and pass our store as a prop)
const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
