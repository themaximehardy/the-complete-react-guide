const redux = require('redux');
const createStore = redux.createStore;

const initialState = {
  counter: 0,
};

// REDUCER
const rootReducer = (state = initialState, action) => {
  return state;
};

// STORE
const store = createStore(rootReducer);
console.log(store.getState()); // undefined

// DISPATCHING ACTION

// SUBSCRIPTION
