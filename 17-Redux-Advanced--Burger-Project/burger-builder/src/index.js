import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux'; // 2 – then import `applyMiddleware` and `compose` from `redux`
import thunk from 'redux-thunk'; // 1 – import `thunk` from `redux-thunk`

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import burgerBuilderReducer from './store/reducers/burgerBuilder';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // 3 – create `composeEnhancers` variable

// 4 – modify `createStore` and add `composeEnhancers(applyMiddleware(thunk))`
const store = createStore(
  burgerBuilderReducer,
  composeEnhancers(applyMiddleware(thunk)),
);

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
