# Redux Advanced

_Useful Resources & Links_

- [Middleware](https://redux.js.org/advanced/middleware/)
- [`redux-thunk` package](https://github.com/gaearon/redux-thunk)
- [Async Actions](https://redux.js.org/advanced/async-actions)

### 1. Introduction

We've learnt the basics about Redux. What it is and why to use it. Let's dive into more **advanced features** and see for example how we may run **asynchronous** code.

### 2. Adding Middleware

Before we dive into running asynchronous code, let's dive into a very important advanced concept with Redux (the package on its own). We may add middlewares to it. Right in between our action being dispatched and it reaches the reducer, this is where we can add middleware.

![middleware](../img/s16/16-1-middleware.png 'middleware')

Middleware basically is a term used for functions or the code general we hook into a process which then gets executed as part of that process without stopping it. So we can add middleware and the action will still reach the reducer thereafter but we can do something with that action before it reaches the reducer. That can be simply logging something. It will become very important later when we want to execute asynchronous code...

Let's see middleware in action by adding it to our project. Let's create our middleware (then we're going to use the ones provided by other providers). A middleware in this case is just a piece of code, specifically a function. We want to create a simple middleware which simply logs each action we issue.

It will get the store as an input, this is the case because we will soon use a specific method provided by Redux to connect our own middleware to the store and this method provided by Redux will eventually execute our middleware function and give us the store.

```js
// This nested function party here is simply a middleware...
const logger = (store) => {
  return (next) => {
    return (action) => [
      // we can access the store, the next and the action here
    ];
  };
};
```

```js
// src/index.js
//...
const logger = (store) => {
  return (next) => {
    return (action) => {
      console.log('[Middleware] Dispatching', action);
      next(action);
    };
  };
};
//...
```

This will now let the action continue to the reducer, though for that to succeed, we need to pass the action as an argument. That's important because we could theoretically also change that action in the middleware, because we have access to it, we get it as an argument, we could change the type... Of course **we should do that with caution** because we can break our application or worse than that, we can implement unexpected behaviors.

```js
// src/index.js
//...
const logger = (store) => {
  return (next) => {
    return (action) => {
      console.log('[Middleware] Dispatching', action);
      const result = next(action);
      console.log('[Middleware] next state', store.getState());
      return result;
    };
  };
};
//...
```

```js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux'; // 1 – add `applyMiddleware`
import { Provider } from 'react-redux';

import counterReducer from './store/reducers/counter';
import resultReducer from './store/reducers/result';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const rootReducer = combineReducers({
  ctr: counterReducer,
  res: resultReducer,
});

// 2 – here is our logger middleware
const logger = (store) => {
  return (next) => {
    return (action) => {
      console.log('[Middleware] Dispatching', action);
      const result = next(action);
      console.log('[Middleware] next state', store.getState());
      return result;
    };
  };
};

// 3 – let's add `applyMiddleware(logger)` to our store
const store = createStore(rootReducer, applyMiddleware(logger));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
```

A more useful use case for a middleware is to be seen later when we actually **handle asynchronous code**.

### 3. Using the Redux Devtools

Let's install and configure the [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension#installation).

Now `compose` is a little bit similar to `combineReducers`, `combineReducers` allows us to combine **reducers**, `compose` allows us to combine **enhancers**, `applyMiddleware` is only for middlewares if we have other enhancers like the store dev tools, we need to use compose to compose a set of enhancers with both the dev tools features and our middleware.

```js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'; // import `compose`
import { Provider } from 'react-redux';

import counterReducer from './store/reducers/counter';
import resultReducer from './store/reducers/result';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const rootReducer = combineReducers({
  ctr: counterReducer,
  res: resultReducer,
});

const logger = (store) => {
  return (next) => {
    return (action) => {
      console.log('[Middleware] Dispatching', action);
      const result = next(action);
      console.log('[Middleware] next state', store.getState());
      return result;
    };
  };
};

// add Redux dev tools like below
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// add make the change inside our createStore
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(logger)),
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
```

One important feature is the **time traveling**, with the Redux dev tools, we can travel through time. This is a extremely nice feature which gives us **a lot of debugging possibilities** and especially in more complex apps. This is great to make sure that **only actions are dispatched we expected to be dispatched** and to find out why the state is currently in well the state it is in.

### 4. Executing Async Code – Intro

In the current project, we don't have any asynchronous tasks. Of course it's easy to create some, let's say that when storing a new result, we actually want to simulate that we also stored this on a server (via a `setTimeout`). And let's do the same for delete a result.

So essentially we want to create asynchronous code/actions, but the reducer function has to run synchronously. We cannot add `setTimeout` because `setTimeout` takes a function and then the timing. We can't return the new state in there, it doesn't work, that's not how javascript works.

```js
// reducer
//...
case actionTypes.STORE_RESULT:
  setTimeout(() => {
    return {
      //... WON'T WORK!
    }
  })
  // return {
  //   ...state,
  //   results: state.results.concat({
  //     value: action.payload.result,
  //     id: new Date(),
  //   }),
  // };
//...
```

So typically what we would do, we would return a promise which calls resolve inside of `setTimeout` after a certain period of time but our reducer just doesn't expect to get a promise... There is no way we can execute asynchronous code in there, but there is a different way though. We can execute asynchronous code with the help of so-called action creators...

### 5. Introducing Action Creators

There is another way of creating actions, so-called **action creators**, how does that look like? What is that? An action creator is just a function which returns an action or which creates an action. So far, we created our actions hardcoded in our code or simply when we need them...

An action creator would return an object and we'll see the benefit when we talk about asynchronous code. So let's create an action creator right now for synchronous code though. For that, we'll create a new function.

```js
// src/store/actions/actions.js
export const INCREMENT = 'INCREMENT';
export const ADD = 'ADD';
export const DECREMENT = 'DECREMENT';
export const SUBSTRACT = 'SUBSTRACT';
export const STORE_RESULT = 'STORE_RESULT';
export const DELETE_RESULT = 'DELETE_RESULT';

// the convention is to use the same name as our identifier but in camel case, so lowercase character first
export const increment = () => {
  return {
    type: INCREMENT,
  };
};
```

```js
// src/containers/Counter/Counter.js
//...
const mapDispatchToProps = (dispatch) => {
  return {
    onIncrementCounter: () => dispatch(actionTypes.increment()), // call it like this
    onDecrementCounter: () =>
      dispatch({
        type: actionTypes.DECREMENT,
      }),
//...
```

### 6. Action Creators and Async Code

```js
// src/store/actions/actions.js
// ACTION TYPES
export const INCREMENT = 'INCREMENT';
export const ADD = 'ADD';
export const DECREMENT = 'DECREMENT';
export const SUBSTRACT = 'SUBSTRACT';
export const STORE_RESULT = 'STORE_RESULT';
export const DELETE_RESULT = 'DELETE_RESULT';

// ACTION CREATORS
export const increment = () => {
  return {
    type: INCREMENT,
  };
};

export const add = (value) => {
  return {
    type: ADD,
    payload: {
      value,
    },
  };
};

export const decrement = () => {
  return {
    type: DECREMENT,
  };
};

export const substract = (value) => {
  return {
    type: SUBSTRACT,
    payload: {
      value,
    },
  };
};

export const storeResult = (result) => {
  return {
    type: STORE_RESULT,
    payload: {
      result,
    },
  };
};

export const deleteResult = (id) => {
  return {
    type: DELETE_RESULT,
    payload: {
      id,
    },
  };
};
```

```js
// src/containers/Counter/Counter.js
//...
const mapDispatchToProps = (dispatch) => {
  return {
    onIncrementCounter: () => dispatch(actionCreators.increment()),
    onDecrementCounter: () => dispatch(actionCreators.decrement()),
    onAddCounter: (value) => dispatch(actionCreators.add(value)),
    onSubstractCounter: (value) => dispatch(actionCreators.substract(value)),
    onStoreResult: (result) => dispatch(actionCreators.storeResult(result)),
    onDeleteResult: (id) => dispatch(actionCreators.deleteResult(id)),
  };
};
//...
```

Should we use them for synchronous code or not? tThe answer is it's up to us, it's a clean way of creating our actions, because we have everything about actions in one file... We don't have to create the action objects anywhere else.

This is a tiny cleanup which can be considered good so nothing speaks against using action creators for synchronous code too but as we will see, it will be extremely useful for asynchronous code.

### 7. Handling Asynchronous Code

We introduced some **synchronous action creators**, now we want to take advantage of them to handle **asynchronous code**. We need to add a special middleware to our Redux project, a third party library we can add called `redux-thunk`.

Generally, this is a library which as we just said adds a middleware to our project which allows our actions / action creators to not return the action itself but return a function which will eventually dispatch an action. With this little trick, not returning the action itself but a function which will then dispatch one, we can run asynchronous code because the eventually dispatched one part is the part which may run asynchronously, it'll become clearer once we add it.

```sh
yarn add redux-thunk
```

```js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'; // import `redux-thunk`

import counterReducer from './store/reducers/counter';
import resultReducer from './store/reducers/result';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const rootReducer = combineReducers({
  ctr: counterReducer,
  res: resultReducer,
});

const logger = (store) => {
  return (next) => {
    return (action) => {
      console.log('[Middleware] Dispatching', action);
      const result = next(action);
      console.log('[Middleware] next state', store.getState());
      return result;
    };
  };
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(logger, thunk)), // add thunk to the applyMiddleware redux function
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
```

We have to keep in mind, here in `storeResult` when we return this function which will get executed by redux-thunk and where we have `setTimeout`, where we then `dispatch` the action which should run asynchronously and update the store, we need to execute `saveResult` which is this action creator as a function of course and pass `result` on.

```js
// SYNC
export const storeResultSync = (result) => {
  return {
    type: STORE_RESULT,
    payload: {
      result,
    },
  };
};

// ASYNC (which dispatch the storeResultSync SYNC below)
export const storeResult = (result) => {
  // because of redux-thunk middleware we have access to dispatch
  return (dispatch) => {
    // our async method here
    setTimeout(() => {
      dispatch(storeResultSync(result));
    }, 2000);
  };
};
```

So only the action dispatch in there after two seconds leaves a footprint because it's our synchronous action (`storeResultSync`) and only synchronous actions may edit the store. The other action creators like `storeResult` which runs some asynchronous code are only possible due to `redux-thunk` and are caught in between. They never make it to the reducer, we only use them as a utility step in-between to run our asynchronous code which happens to be required to run on a lot of actions and then dispatch the synchronous action to change the state in the store once we are certain that we know what to do there, so once our asynchronous code finished.

### 8. Restructuring Actions

We introduced **action creators** and we learned that they are especially useful when working with **asynchronous code** because together with `redux-thunk`, that middleware, we could basically find a place to execute our asynchronous code when dispatching an action and block that original dispatching to then just dispatch another action, all that handled by that `redux-thunk` middleware once our asynchronous task is done.

We split up the **reducers** into `counter` and `result` and we typically do that for **actions** as our application grows and we're going to see that in the burger builder project.

![actions-folder-structure](../img/s16/16-2-actions-folder-structure.png 'actions-folder-structure')

```js
// src/store/actions/actionTypes.js
// ACTION TYPES
export const INCREMENT = 'INCREMENT';
export const ADD = 'ADD';
export const DECREMENT = 'DECREMENT';
export const SUBSTRACT = 'SUBSTRACT';
export const STORE_RESULT = 'STORE_RESULT';
export const DELETE_RESULT = 'DELETE_RESULT';
```

```js
// src/store/actions/index.js
export { add, substract, increment, decrement } from './counter';
export { storeResult, deleteResult } from './result';
```

```js
// src/store/actions/result.js
import * as actionTypes from './actionTypes';

// ACTION CREATORS
// SYNC
export const storeResultSync = (result) => {
  return {
    type: actionTypes.STORE_RESULT,
    payload: {
      result,
    },
  };
};

// ASYNC (which dispatch the storeResultSync SYNC below)
export const storeResult = (result) => {
  // because of redux-thunk middleware we have access to dispatch
  return (dispatch) => {
    // our async method here
    setTimeout(() => {
      dispatch(storeResultSync(result));
    }, 2000);
  };
};

export const deleteResult = (id) => {
  return {
    type: actionTypes.DELETE_RESULT,
    payload: {
      id,
    },
  };
};
```

### 9. Where to Put Data Transforming Logic?

The only place where we can execute **asynchronous code** is in our **action creator**, it's what `redux-thunk` is made for and it's the common and best practice pattern if we need to reach out to a server to fetch data from it and thereafter store it in your store. Definitely do that with the action creator.

However we can of course put much more logic into your action creators, think about `storeResultSync`, we save our result there, we get it as an argument and we simply return an action where we pass it on as a payload. Now this is a very dry action creator, it doesn't do anything else but just return object with the unchanged result.

```js
// src/store/actions/result.js
//...
export const storeResultSync = (result) => {
  const updatedResult = result * 2;
  return {
    type: actionTypes.STORE_RESULT,
    payload: {
      updatedResult,
    },
  };
};
//...
```

Now we have **logic** in the **action creator** and this might be valid logic instead of some nonsense operation like above. We could also execute the same logic if we need to transform the data before storing it in the state which is perfectly fine which might happen. We could execute it in our **reducer**.

What is better, using the action creator or the reducer to change our data? Where to put the logic?

![action-creators-vs-reducers](../img/s16/16-3-action-creators-vs-reducers.png 'action-creators-vs-reducers')

Max lean towards **putting the logic into the reducer** and **not too much logic into the action creator**. Asynchronous code has to go there but once we got back the data from the server you might need to reach out, we can of course transform it in the action creator and we should do that to a certain extent but once we've got data that is relatively clean, we should hand it off to the reducer. And if you then still need to manipulate it, for example by taking 8 times 2 or anything like that, in Max's opinion that should go into the reducer.

If we choose one approach, stick to it though, don't change it, don't put a lot of logic in one action creator, just to then have a lot of logic in another reducer. Be consistent and decide, where do we want to transform and prepare our data, the action creator or reducer, Max recommends the latter but ultimately it's up to us, just take a consistent route.

### 10. Using Action Creators and Get State

If we chose the **action creator**, here's another utility method we might want to know when working with thunk, so with asynchronous code handled by `redux-thunk`. `redux-thunk` can pass as an additional argument, `getState`, that is a method we can **execute to get the current state**. Sometimes in your asynchronous code, we need to be able to reach out to the state prior to our to-be-dispatched action, let's say we want to save some data for a given user and we have the id of the user stored in our redux state, we can then get it with getState.

```js
// src/store/actions/result.js
//...
// ASYNC (which dispatch the storeResultSync SYNC below)
export const storeResult = (result) => {
  // because of redux-thunk middleware we have access to dispatch
  return (dispatch, getState) => {
    // our async method here
    setTimeout(() => {
      const oldCounter = getState().ctr.counter;
      console.log(oldCounter);
      dispatch(storeResultSync(result));
    }, 2000);
  };
};
//...
```

If we need it, it's a nice utility function, but we shouldn't overuse it though. Max tries to write his action creators and reducers in a way that he doesn't have to use `getState`. **Instead we can pass all the data we need in our async action creator like the user id into it by accepting it as an argument**.

### 11. Using Utility Functions

Now we want to dive into advanced reducers set ups, right now we have two reducers. It's a bit advanced because we already split it up and use combined reducers but **each reducer still has a relatively long switch statement** and even when breaking up your reducers into multiple files, we probably still have relatively long switch case statements for each reducer, at least if it handles more than two actions.

So cleaning up that reducer file a bit more can be an idea and... it's not a must, **it's optional**. It's a **good practice but we don't have to do it**.

We could create utility functions for updating objects and arrays...

```js
// src/store/utility.js
export const updateObject = (oldObject, updatedValues) => {
  return {
    ...oldObject,
    ...updatedValues,
  };
};
```

```js
// src/store/reducers/counter.js
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  counter: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INCREMENT:
      return updateObject(state, { counter: state.counter + 1 });
    case actionTypes.DECREMENT:
      return updateObject(state, { counter: state.counter - 1 });
    case actionTypes.ADD:
      return updateObject(state, {
        counter: state.counter + action.payload.value,
      });
    case actionTypes.SUBSTRACT:
      return updateObject(state, {
        counter: state.counter - action.payload.value,
      });
    default:
      return state;
  }
};

export default reducer;
```

```js
// src/store/reducers/result.js
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  results: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.STORE_RESULT:
      return updateObject(state, {
        results: state.results.concat({
          value: action.payload.result,
          id: new Date(),
        }),
      });
    case actionTypes.DELETE_RESULT:
      // filter returns a new array!!
      const updatedArray = state.results.filter(
        (result) => result.id !== action.payload.id,
      );
      return updateObject(state, { results: updatedArray });
    default:
      return state;
  }
};

export default reducer;
```

### 12. A Leaner Switch Case Statement

```js
// src/store/reducers/result.js
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  results: [],
};

// we created deleteResult, to outsource the logic of the DELETE_RESULT action... As a result, our switch statement stays lean!
const deleteResult = (state, action) => {
  const updatedArray = state.results.filter(
    (result) => result.id !== action.payload.id,
  );
  return updateObject(state, { results: updatedArray });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.STORE_RESULT:
      return updateObject(state, {
        results: state.results.concat({
          value: action.payload.result,
          id: new Date(),
        }),
      });
    case actionTypes.DELETE_RESULT:
      return deleteResult(state, action);
    default:
      return state;
  }
};

export default reducer;
```

### 13. Diving Much Deeper

[Redux](https://redux.js.org/introduction/getting-started) has so many use cases and possible adjustments we can look into that. Max strongly recommends having a look at this page if we feel like our current approach has us stuck or our reducer functions are exploding, we can learn more about possible alternative practices and best practices [here](https://redux.js.org/introduction/getting-started).

Let's have a look at the [immutable update patterns](https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns).
