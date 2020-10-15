const redux = require('redux');
const createStore = redux.createStore;

const initialState = {
  counter: 0,
};

// REDUCER
const rootReducer = (state = initialState, action) => {
  if (action.type === 'INC_COUNTER') {
    return {
      ...state,
      counter: state.counter + 1,
    };
  }
  if (action.type === 'ADD_COUNTER') {
    return {
      ...state,
      counter: state.counter + action.payload.value,
    };
  }
  return state;
};

// STORE
const store = createStore(rootReducer);
console.log(store.getState());

// SUBSCRIPTION
store.subscribe(() => {
  console.log('[Subscription]:', store.getState());
});

// DISPATCHING ACTION
store.dispatch({ type: 'INC_COUNTER' });
store.dispatch({ type: 'ADD_COUNTER', payload: { value: 10 } });
console.log(store.getState());
