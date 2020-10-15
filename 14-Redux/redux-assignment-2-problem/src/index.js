import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'; // 1 – import `createStore` from `redux`
import { Provider } from 'react-redux'; // 4 – import  `Provider` from `react-redux` and connect the Store to React

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reducer from './store/reducer'; // 2 – create a reducer (by convention, inside a folder `store` we create)

const store = createStore(reducer); // 3 – create a constant store via `createStore` and pass our reducer

// 5 – wrap our App component with our Provider, where we pass the store!
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
