# Redux

_Useful Resources & Links_

- [Redux Docs](https://redux.js.org/)
- [Core Concepts](https://redux.js.org/introduction/core-concepts)
- [Actions](https://redux.js.org/basics/actions)
- [Reducers](https://redux.js.org/basics/reducers)
- [Redux FAQs](https://redux.js.org/faq)

### 1. Introduction

Redux is a **core module** in this course. **Redux** is often used with React but it's a standalone **third party library**. It is a library often used in React projects though to **make state management easier**.

Let's first understand what exactly **state** is and what exactly **Redux** then is and how it works.

### 2. Understanding State

State for example are the **ingredients** we added to our burger, that's part of our application state of our burger builder application. The information, which ingredients we added is crucial because it determines what we need to **render** to the screen, how should our burger preview look like? It's also important behind the scenes when we store that burger on a server and we need to submit all these ingredients in the HTTP request.

Another state, could be – **is the user authenticated?**. That can be super important as it might determine the options we're showing in the menu or the access we're granting to certain components.

Also interesting is **UI statelike** is a given **modal open**, is a backdrop open, should it be open (it's less about data like ingredients and user authentication is, it's more about our pure UI only state)?

_What's now so complex about state? Why do we need extra library for that? Let's take a closer look._

### 3. The Complexity of Managing State

**State management can be very complex** and React is great at reacting to state changes and updating the UI accordingly but managing that state can get very difficult as our application grows.

Of course React gives us the **built-in state property** which we use, but we could already see in our burger builder project that passing the ingredients from component A to component B can be very difficult and we had to use _routing query parameters_ for that, certainly a **workaround** but not a very elegant one.

![state-management](../img/s14/14-1-state-management.png 'state-management')

The problem now is what if we all need that information in a totally different area of our app...

![state-management](../img/s14/14-2-state-management.png 'state-management')

Well that is super complex and a very long chain of props or query params we manage to pass data around.

![state-management](../img/s14/14-3-state-management.png 'state-management')

It's a pity that it is this difficult because in the end, we're writing JavaScript and we're having a bundled JavaScript file as output (or a couple of bundles if we're using lazy loading). **Why can't we just set some global variable** which is a **JavaScript object** which **stores our entire application state** and which **we can access from anywhere**?

The reason is that React's reactivity system doesn't react to changes in some global variable you defined and it's good that it doesn't. That makes React so efficient. However, having this global store still sounds very interesting and that's exactly what Redux is about as we will learn.

### 4. Understanding the Redux Flow

How does redux work? Well remember that idea of having some central place where we manage the entire state... we said that we can't use a global variable for that and we can't! But Redux gives us a certain flow of data (= a certain way of managing data) that we can nicely integrate with another package into our react app, so that React does react to changes of data.

Let's describe how Redux works. How does it manage data and how does it update it? In the end, it's all about a **central store** we have in each Redux application.

_Note: Redux is a third party library which works totally independent of React, it's most often seen in conjunction with React but theoretically, it's independent._

So it's all about a **central store**, this store stores the **entire application state**, it's that simple, we can think about it as a **giant JavaScript object**.

In a React application **we've got components** and a component probably **wants to manipulate or get the current application state**, now it **doesn't do that by directly manipulating that central JavaScript object**, that would n**ot be picked up by React's reactivity** system and even worse, it would make our **store pretty unpredictable**. If we added it from anywhere in our application, that we can never see where we made a certain change that broke our app, for example. So we need to have **a clear, predictable process of updating the state** on which we can rely on and which is the **only process** that can change our state.

That is actually what **Redux** is all about, having a clearly defined process of how your state may change.

#### ACTIONS (= **messenger**, with a `type` and sometimes a `payload`)

The first building block besides the central store are **actions** which are **dispatched** from our JavaScript code, in a react app, they are **dispatched from within your components**. And action is _just information package in the end_ with a **type** (kind of a description), something like `addIngredient` or `removeIngredient`. Possibly, it also holds a **payload**, for example if the action is `addIngredient`, we need to also pass the information which ingredient and that would also be a part of the action.

So it's an information package we're sending out to the world or to Redux to be precise, that action doesn't directly reach the store, that action **doesn't hold any logic**, it **doesn't know how to update the store**, **it's just a messenger**.

#### REDUCERS

The part which change the store is a **reducer**. We'll end up with one route reducer which is directly connected to our store in the end. So the **action reaches the reducer** and since the action contains a **type**, the **reducer can check the type of the action**. For example if it's `addIngredient` and we then define the code for that type of action in the reducer. The reducer in the end is _just a pure function_ which receives **the action and the old state as input** and which then **returns an updated state**. The important thing is that the **reducer has to execute synchronous code only**, _no asynchronous code, no side effects, no HTTP requests,..._ We'll learn later how we can still implement asynchronous code but in reducers, it's just input in, output out, nothing in between, no delay.

The reducer returns the updated state which then is stored in the store and replaces the old state and that **has to be done in an immutable way**, so **we always return a new state which can be based on the old one but which is technically a new JavaScript object**, because objects are reference types in Javascript and we want to make sure that we don't accidentally change the old one.

This is how the reducer handles the action, now the store is up to date. How do we get the updated state back into our component then? For that, we use a **subscription model**.

#### SUBSCRIPTION

The store triggers all subscriptions whenever the state changes, whenever the state is updated in the store. And of course our component can subscribe to store updates and it then receives that update automatically, this is how simple it is. It works through a subscription model and we simply say: "hey I want to get notified whenever the state changes", just as we say: "hey I want to change the state, here is an action describing my plans".

This is the redux flow, this is how redux works.

![redux-flow](../img/s14/14-4-redux-flow.png 'redux-flow')

### 5. Setting Up Reducer and Store

Let's start with the basic project and install `redux` (the Redux library works standalone and we'll actually use it standalone for now but we'll soon add it to our React application to see how it works together with it).

```sh
yarn add redux
```

Then let's create a new file in the `src` folder – `redux-basics.js`. Now this file will not be holding any React code, we won't include it into our React project. We'll execute it with Nodejs instead, just to show the different concepts of Redux in one file and to show that it's independent of React.

```js
// src/redux-basics.js
const redux = require('redux');
const createStore = redux.createStore; // createStore as the name suggests allows us to create a new redux store

// STORE
const store = createStore();
/* 
`createStore` like this won't do much though, a store needs to be initialized with a reducer because the reducer 
and remember we only have one reducer, even if we combine multiple ones, they will be merged into one.
*/

// REDUCER

// DISPATCHING ACTION

// SUBSCRIPTION
```

The reducer is strongly connected to the store, it's the only thing that may update the state in the end. That's why we need to pass the reducer to this creation function because it's so closely connected to the state.

```js
// src/redux-basics.js
const redux = require('redux');
const createStore = redux.createStore;

// REDUCER
const rootReducer = (state, action) => {
  return state;
};

// STORE
const store = createStore();

// DISPATCHING ACTION

// SUBSCRIPTION
```

`rootReducer` function receives **two arguments**, the first one is the current `state` (oldState, which it then may update) and the `action`. The function has to **return one thing** and that is the **updated state**.

The simplest reducer you can write simply returns the old state (as above), so this is a valid reducer (as above) though of course it does nothing, it just returns the state you already had.

```js
// src/redux-basics.js
const redux = require('redux');
const createStore = redux.createStore;

// REDUCER
const rootReducer = (state, action) => {
  return state;
};

// STORE
const store = createStore(rootReducer);
console.log(store.getState()); // undefined

// DISPATCHING ACTION

// SUBSCRIPTION
```

But we can already use that reducer and pass it as an argument to `createStore` `rootReducer`, with that, our reducer our store is created with that reducer in mind and now we have a created store, however this store will hold an `undefined` state.

```js
// src/redux-basics.js
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
console.log(store.getState()); // { counter: 0 }

// DISPATCHING ACTION

// SUBSCRIPTION
```

So this is how we create a store with a reducer and how we initialize the state, how do we now subscribe to the state and dispatch actions?

### 6. Dispatching Actions

An action is dispatched by simply accessing the store, so the `store` constant which holds the created store, we can call `dispatch`. `dispatch` is a function which takes an argument and that argument is an **action**, that should be a **JavaScript object** which needs to have a `type` property (with a unique identifier of our choice).

We can also pass some optional `payload`, we'll do this with the next action. Besides `INC_COUNTER`, let's also dispatch `ADD_COUNTER`. Now `INC_COUNTER` should increase it by 1, so we don't need to pass any extra information but `ADD_COUNTER` should actually add a specific number to the counter and that value needs to be passed.

```js
// src/redux-basics.js
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
console.log(store.getState()); // { counter: 0 }

// DISPATCHING ACTION
store.dispatch({ type: 'INC_COUNTER' });
// store.dispatch({ type: 'ADD_COUNTER', value: 10, name, id }); // an example, doesn't need to be payload, only type is required
store.dispatch({ type: 'ADD_COUNTER', payload: { value: 10 } });
console.log(store.getState()); // { counter: 0 }

// SUBSCRIPTION
```

Let's add some logic...

```js
// BAD
//...
// REDUCER
const rootReducer = (state = initialState, action) => {
  if (action.type === 'INC_COUNTER') {
    state.counter++; // WE CAN'T, because we're mutating our original state
    return state;
  }
};
//...
```

What we do instead is we return a new JavaScript object where we may first copy the old state with the spread operator. And we overwrite the one property we want to adjust. So the counter has to be a copy, so that we never mutate any data, never, always do this immutably.

```js
// GOOD
//...
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
};
//...
```

```js
// src/redux-basics.js
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
console.log(store.getState()); // { counter: 0 }

// DISPATCHING ACTION
store.dispatch({ type: 'INC_COUNTER' });
// store.dispatch({ type: 'ADD_COUNTER', value: 10, name, id }); // an example, doesn't need to be payload, only type is required
store.dispatch({ type: 'ADD_COUNTER', payload: { value: 10 } });
console.log(store.getState()); // { counter: 11 }

// SUBSCRIPTION
```

### 7. Adding Subscriptions

This is how a subscription works, it's getting triggered whenever the state is updated.

```js
// src/redux-basics.js
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
```

```js
// console.log results
{ counter: 0 }
[Subscription]: { counter: 1 }
[Subscription]: { counter: 11 }
{ counter: 11 }
```

### 8. Connecting React to Redux

We want to connect our React application to Redux and use the advantages of Redux in it, so that in the end, we managed our state with a counter and the buttons with Redux.

This store should be created right before our application (or when our application starts), so the `index.js` file is a great place, this is where we mount our app component to the dom, so creating the store here also makes a lot of sense.

```js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'; // import `createStore` from `redux`

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reducer from './store/reducer'; // create a reducer (by convention, inside a folder `store` we create)

const store = createStore(reducer); // create a constant store via `createStore` and pass our reducer

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
```

```js
// src/store/reducer.js
// create an initial state
const initialState = {
  counter: 0,
};

// create a reducer (a simple function) which takes a state and an action
const reducer = (state = initialState, action) => {
  // currently it doesn't do much
  return state;
};

export default reducer;
```

### 9. Connecting the Store to React

Let's connect our store to React, we already got a store, now we need to connect it. We need a special package because Redux alone is standalone, it is not connected to React.

```sh
yarn add react-redux
```

It allows us to hook up our Redux store to our React application. We import the `Provider` which we wrap our app component with it. `Provider` is a helper component which allows us to inject our store into the React components. For hooking up the provider component with our store, we need to set up a property.

```js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux'; // import `Provider` from `react-redux`

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reducer from './store/reducer';

const store = createStore(reducer);

// we wrap our App with `Provider` (and we pass the prop store, here store)
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
```

There still is something missing, how do we actually get the data from the store, like the counter value in our `Counter` container. Well for that, we need to connect this individual container with the store (we want to set up our subscription).

```js
// src/containers/Counter/Counter.js
import React, { Component } from 'react';
import { connect } from 'react-redux'; // we import `connect` from `react-redux`
//...
class Counter extends Component {
  state = {
    counter: 0,
  };

  //...
}

export default connect()(Counter); // use connect like this
```

`connect` is not really a higher order component (HOC), it's a function which returns a higher order component. The whole idea behind this complex set up simply is that `connect` also can be called as a function and since it returns a function, we then execute the result of connect of this function execution.

We passed two pieces of information to `connect`. Which part of the whole application **state** is interesting to us because here we only have `counter` but in bigger apps, we may have loads and loads of different states and pieces of states we manage and we don't need all of that. So we can define which slice of the state do we want to get in the component/container and which **actions** do we want to dispatch because again, in bigger applications we may have thousands of actions dispatched from all over the application but a given individual container may only dispatch a couple of these. So the **actions** we want to dispatch and the **state** we want to get.

`mapStateToProps` the name is totally up to us but it's very clear about what we will store in here. Our store instructions about how the state managed by Redux should be mapped to props we can use in this container because that's important, the state managed Redux is not received as state here because state is the thing you change internally from within a component. `mapStateToProps`, it actually stores a function which expects the state stored in Redux as the input and returns a JavaScript object which is a map of prop names and slices of the state stored in Redux.

```js
// src/containers/Counter/Counter.js
import React, { Component } from 'react';
import { connect } from 'react-redux'; // import `connect` from `react-redux`

import CounterControl from '../../components/CounterControl/CounterControl';
import CounterOutput from '../../components/CounterOutput/CounterOutput';

class Counter extends Component {
  // leave the internal state right now
  state = {
    counter: 0,
  };

  counterChangedHandler = (action, value) => {
    switch (action) {
      case 'inc':
        this.setState((prevState) => {
          return { counter: prevState.counter + 1 };
        });
        break;
      case 'dec':
        this.setState((prevState) => {
          return { counter: prevState.counter - 1 };
        });
        break;
      case 'add':
        this.setState((prevState) => {
          return { counter: prevState.counter + value };
        });
        break;
      case 'sub':
        this.setState((prevState) => {
          return { counter: prevState.counter - value };
        });
        break;
    }
  };

  render() {
    return (
      <div>
        <CounterOutput value={this.props.ctr} />
        {/* <CounterOutput value={this.state.counter} /> */}
        <CounterControl
          label="Increment"
          clicked={() => this.counterChangedHandler('inc')}
        />
        <CounterControl
          label="Decrement"
          clicked={() => this.counterChangedHandler('dec')}
        />
        <CounterControl
          label="Add 5"
          clicked={() => this.counterChangedHandler('add', 5)}
        />
        <CounterControl
          label="Subtract 5"
          clicked={() => this.counterChangedHandler('sub', 5)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ctr: state.counter,
  };
};

export default connect(mapStateToProps)(Counter);
```

### 10. Dispatching Actions from within the Component

We also want to be able to dispatch actions, and for that we need to find out how we can also dispatch actions from within our components. When we use only Redux in standalone, we simply called dispatch on the store. Now we don't have access to the store in our container at least not directly, we got access through connect. And just as we were able to pass some information about which kind of state we want to get, we can also pass a second configuration, we'll name it `mapDispatchToProps` because here we'll say which kind of actions do wwe want to dispatch in this container.

We then here also return a JavaScript object where we can define some prop names which will hold a reference to a function which should eventually get executed to dispatch an action. Now we can choose any property name, for example `onIncrementCounter`.

```js
// src/containers/Counter/Counter.js
//...
const mapStateToProps = (state) => {
  return {
    ctr: state.counter,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIncrementCounter: () =>
      dispatch({
        type: 'INCREMENT',
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
//...
```

We want to return a call to `dispatch` this function (as above) here will in the end be available through this property and therefore, whenever this property is executed as a function. For example, if we assign it to an `onClick` handler, then this `dispatch` method here is going to get executed. And to this method, we can now pass a JavaScript object where we need to set up a type (and an optional payload).

_Notes: if we don't have any actions in our container, we just leave it out as we did before `export default connect(mapStateToProps)(Counter);` and if we have a container which only needs to dispatch actions but doesn't need a slice of the state, we'll simply pass null as the first argument to connect `export default connect(null, mapDispatchToProps)(Counter);`._

```js
// src/containers/Counter/Counter.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
//...
class Counter extends Component {
  state = {
    counter: 0,
  };

  counterChangedHandler = (action, value) => {
    switch (action) {
      case 'inc':
        this.setState((prevState) => {
          return { counter: prevState.counter + 1 };
        });
        break;
      //...
    }
  };

  render() {
    return (
      <div>
        <CounterOutput value={this.props.ctr} />
        {/* <CounterOutput value={this.state.counter} /> */}
        <CounterControl
          label="Increment"
          clicked={this.props.onIncrementCounter} // USING OUR DISPATCH METHOD
          // clicked={() => this.counterChangedHandler('inc')} // BEFORE
        />
        {...}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ctr: state.counter,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIncrementCounter: () =>
      dispatch({
        type: 'INCREMENT',
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

### 11. Assignment 4 – Dispatching Actions

```js
// src/store/reducer.js
const initialState = {
  counter: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        counter: state.counter + 1,
      };
    case 'DECREMENT':
      return {
        ...state,
        counter: state.counter - 1,
      };
    case 'ADD':
      return {
        ...state,
        counter: state.counter + action.payload.value,
      };
    case 'SUBSTRACT':
      return {
        ...state,
        counter: state.counter - action.payload.value,
      };
    default:
      return state;
  }
};

export default reducer;
```

```js
// src/containers/Counter/Counter.js
import React, { Component } from 'react';
import { connect } from 'react-redux';

import CounterControl from '../../components/CounterControl/CounterControl';
import CounterOutput from '../../components/CounterOutput/CounterOutput';

class Counter extends Component {
  state = {
    counter: 0,
  };

  render() {
    return (
      <div>
        <CounterOutput value={this.props.ctr} />
        <CounterControl
          label="Increment"
          clicked={this.props.onIncrementCounter}
        />
        <CounterControl
          label="Decrement"
          clicked={this.props.onDecrementCounter}
        />
        <CounterControl
          label="Add 5"
          clicked={() => this.props.onAddCounter(5)}
        />
        <CounterControl
          label="Subtract 5"
          clicked={() => this.props.onSubstractCounter(5)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ctr: state.counter,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIncrementCounter: () =>
      dispatch({
        type: 'INCREMENT',
      }),
    onDecrementCounter: () =>
      dispatch({
        type: 'DECREMENT',
      }),
    onAddCounter: (value) =>
      dispatch({
        type: 'ADD',
        payload: {
          value,
        },
      }),
    onSubstractCounter: (value) =>
      dispatch({
        type: 'SUBSTRACT',
        payload: {
          value,
        },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

### 12. Passing and Retrieving Data with Action

See the example above 👆.

### 13. Switch-Case in the Reducer

See the example above 👆.

### 14. Updating State Immutably

Let's dive into more state management and let's add a new state `results: []`.

```js
// VERY BAD – we're mutating the state
//...
case 'INCREMENT':
  const newState = state;
  newState.counter = state.counter + 1; // WE CAN'T DO THAT
  return newState;
case 'DECREMENT':
//...
```

```js
// GOOD – 1 way to do it
//...
case 'INCREMENT':
  const newState = Object.assign({}, state); // this will basically clone the old object in an immutable way
  newState.counter = state.counter + 1;
  return newState; // it is a technically a new object
case 'DECREMENT':
//...
```

`Object.assign` will basically clone the old object in an immutable way giving us a new JavaScript object which has all the properties of the old object but is a technically a different object. It is very important due to the way Objects and Array work in JavaScript with the reference types or these primitive types.

```js
// BETTER WAY – 1 way to do it
//...
case 'INCREMENT':
  return {
    ...state,
    counter: state.counter + 1,
  };
case 'DECREMENT':
//...
```

This simply tells JavaScript return a JavaScript object, take all the properties and values of the state argument which is our old state, distribute these properties with their values in this new object and then since we define an additional property, add this property to the object or if it was already present due to us distributing the old state as it would be for the `counter`, this is part of the old state, overwrite this but only this, leave `results` untouched.

```js
//...
case 'STORE_RESULT':
  return {
    ...state,
    results: state.results.concat({ value: state.counter, id: new Date() }), // push manipulates the original value... we use concat which is the immutable way of doing it
  };
case 'DELETE_RESULT':
//...
```

```js
// src/store/reducer.js
const initialState = {
  counter: 0,
  results: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        counter: state.counter + 1,
      };
    case 'DECREMENT':
      return {
        ...state,
        counter: state.counter - 1,
      };
    case 'ADD':
      return {
        ...state,
        counter: state.counter + action.payload.value,
      };
    case 'SUBSTRACT':
      return {
        ...state,
        counter: state.counter - action.payload.value,
      };
    case 'STORE_RESULT':
      return {
        ...state,
        results: state.results.concat({ value: state.counter, id: new Date() }), // push manipulates the original value... we use concat which is the immutable way of doing it
      };
    case 'DELETE_RESULT':
      return {
        ...state,
        results: [],
      };
    default:
      return state;
  }
};

export default reducer;
```

```js
// src/containers/Counter/Counter.js
import React, { Component } from 'react';
import { connect } from 'react-redux';

import CounterControl from '../../components/CounterControl/CounterControl';
import CounterOutput from '../../components/CounterOutput/CounterOutput';

class Counter extends Component {
  state = {
    counter: 0,
  };

  render() {
    return (
      <div>
        <CounterOutput value={this.props.ctr} />
        <CounterControl
          label="Increment"
          clicked={this.props.onIncrementCounter}
        />
        <CounterControl
          label="Decrement"
          clicked={this.props.onDecrementCounter}
        />
        <CounterControl
          label="Add 5"
          clicked={() => this.props.onAddCounter(5)}
        />
        <CounterControl
          label="Subtract 5"
          clicked={() => this.props.onSubstractCounter(5)}
        />
        <hr />
        <button onClick={this.props.onStoreResult}>Store Result</button>
        <ul>
          {this.props.storedResults.map((result) => (
            <li key={result.id} onClick={this.props.onDeleteResult}>
              {result.value}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ctr: state.counter,
    storedResults: state.results,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIncrementCounter: () =>
      dispatch({
        type: 'INCREMENT',
      }),
    onDecrementCounter: () =>
      dispatch({
        type: 'DECREMENT',
      }),
    onAddCounter: (value) =>
      dispatch({
        type: 'ADD',
        payload: {
          value,
        },
      }),
    onSubstractCounter: (value) =>
      dispatch({
        type: 'SUBSTRACT',
        payload: {
          value,
        },
      }),
    onStoreResult: () =>
      dispatch({
        type: 'STORE_RESULT',
      }),
    onDeleteResult: () =>
      dispatch({
        type: 'DELETE_RESULT',
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

### 15. Updating Arrays Immutably

```js
//...
case 'DELETE_RESULT':
  const id = 2;
  state.results.splice(id, 1); // THIS IS NOT IMMUTABLE
  return {
    ...state,
    results: state.results,
  };
default:
//...
```

```js
// SOLUTION 1
//...
case 'DELETE_RESULT':
  const id = 2;
  const newArray = [...state.results]; // we create a copy of the array
  newArray.splice(id, 1)
  return {
    ...state,
    results: newArray,
  };
default:
//...
```

```js
// SOLUTION 2
//...
case 'DELETE_RESULT':
  // filter returns a new array!!
  const updatedArray = state.results.filter(
    (result) => result.id !== action.payload.id,
  );
  return {
    ...state,
    results: updatedArray,
  };
default:
//...
```

```js
// src/store/reducer.js
const initialState = {
  counter: 0,
  results: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    //...
    case 'STORE_RESULT':
      return {
        ...state,
        results: state.results.concat({ value: state.counter, id: new Date() }), // push manipulates the original value... we use concat which is the immutable way of doing it
      };
    case 'DELETE_RESULT':
      // filter returns a new array!!
      const updatedArray = state.results.filter(
        (result) => result.id !== action.payload.id,
      );
      return {
        ...state,
        results: updatedArray,
      };
    default:
      return state;
  }
};

export default reducer;
```

```js
// src/containers/Counter/Counter.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
//...
class Counter extends Component {
  state = {
    counter: 0,
  };

  render() {
    return (
      <div>
        {...}
        <button onClick={this.props.onStoreResult}>Store Result</button>
        <ul>
          {this.props.storedResults.map((result) => (
            <li
              key={result.id}
              onClick={() => this.props.onDeleteResult(result.id)} // ADD
            >
              {result.value}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ctr: state.counter,
    storedResults: state.results,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //...
    onStoreResult: () =>
      dispatch({
        type: 'STORE_RESULT',
      }),
    onDeleteResult: (id) =>
      dispatch({
        type: 'DELETE_RESULT',
        payload: {
          id,
        },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

### 16. Immutable Update Patterns

Let's have a read to [Immutable Update Patterns on reduxjs.org](https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns/).

#### Updating Nested Objects

The key to updating nested data is **that every level of nesting must be copied and updated appropriately**. This is often a difficult concept for those learning Redux, and there are some specific problems that frequently occur when trying to update nested objects. These lead to accidental direct mutation, and should be avoided.

#### Common Mistake #1: New variables that point to the same objects

Defining a new variable does not create a new actual object - it only creates another reference to the same object. An example of this error would be:

```js
function updateNestedState(state, action) {
  let nestedState = state.nestedState;
  // ERROR: this directly modifies the existing object reference - don't do this!
  nestedState.nestedField = action.data;

  return {
    ...state,
    nestedState,
  };
}
```

This function does correctly return a shallow copy of the top-level state object, but because the `nestedState` variable was still pointing at the existing object, the state was directly mutated.

#### Common Mistake #2: Only making a shallow copy of one level

Another common version of this error looks like this:

```js
function updateNestedState(state, action) {
  // Problem: this only does a shallow copy!
  let newState = { ...state };

  // ERROR: nestedState is still the same object!
  newState.nestedState.nestedField = action.data;

  return newState;
}
```

Doing a shallow copy of the top level is not sufficient - the `nestedState` object should be copied as well.

#### Correct Approach: Copying All Levels of Nested Data

Unfortunately, the process of correctly applying immutable updates to deeply nested state can easily become verbose and hard to read. Here's what an example of `updating state.first.second[someId].fourth` might look like:

```js
function updateVeryNestedField(state, action) {
  return {
    ...state,
    first: {
      ...state.first,
      second: {
        ...state.first.second,
        [action.someId]: {
          ...state.first.second[action.someId],
          fourth: action.someValue,
        },
      },
    },
  };
}
```

Obviously, each layer of nesting makes this harder to read, and gives more chances to make mistakes. This is one of several reasons why you are encouraged to keep your state flattened, and compose reducers as much as possible.

#### Inserting and Removing Items in Arrays

Normally, a Javascript array's contents are modified using mutative functions like `push`, `unshift`, and `splice`. Since we don't want to mutate state directly in reducers, those should normally be avoided. Because of that, you might see "insert" or "remove" behavior written like this:

```js
function insertItem(array, action) {
  return [
    ...array.slice(0, action.index),
    action.item,
    ...array.slice(action.index),
  ];
}

function removeItem(array, action) {
  return [...array.slice(0, action.index), ...array.slice(action.index + 1)];
}
```

However, remember that the key is that the _original in-memory reference_ is not modified. **As long as we make a copy first, we can safely mutate the copy**. Note that this is true for both arrays and objects, but nested values still must be updated using the same rules.

This means that we could also write the insert and remove functions like this:

```js
function insertItem(array, action) {
  let newArray = array.slice();
  newArray.splice(action.index, 0, action.item);
  return newArray;
}

function removeItem(array, action) {
  let newArray = array.slice();
  newArray.splice(action.index, 1);
  return newArray;
}
```

The remove function could also be implemented as:

```js
function removeItem(array, action) {
  return array.filter((item, index) => index !== action.index);
}
```

#### Updating an Item in an Array

Updating one item in an array can be accomplished by using `Array.map`, returning a new value for the item we want to update, and returning the existing values for all other items:

```js
function updateObjectInArray(array, action) {
  return array.map((item, index) => {
    if (index !== action.index) {
      // This isn't the item we care about - keep it as-is
      return item;
    }

    // Otherwise, this is the one we want - return an updated value
    return {
      ...item,
      ...action.item,
    };
  });
}
```

#### Immutable Update Utility Libraries

Because writing immutable update code can become tedious, there are a number of utility libraries that try to abstract out the process. These libraries vary in APIs and usage, but all try to provide a shorter and more succinct way of writing these updates. Some, like [dot-prop-immutable](https://github.com/debitoor/dot-prop-immutable), take string paths for commands:

```js
state = dotProp.set(state, `todos.${index}.complete`, true);
```

Others, like [immutability-helper](https://github.com/kolodny/immutability-helper) (a fork of the now-deprecated React Immutability Helpers addon), use nested values and helper functions:

```js
const collection = [1, 2, { a: [12, 17, 15] }];
const newCollection = update(collection, {
  2: { a: { $splice: [[1, 1, 13, 14]] } },
});
```

They can provide a useful alternative to writing manual immutable update logic.

### 17. Outsourcing Action Types

It is a good practice to outsource our action types into constants. We can use in our application so that we always just import a constant and eliminate the danger of mistyping, this is especially useful as our application grows.

```js
// src/store/actions.js
export const INCREMENT = 'INCREMENT';
export const ADD = 'ADD';
export const DECREMENT = 'DECREMENT';
export const SUBSTRACT = 'SUBSTRACT';
export const STORE_RESULT = 'STORE_RESULT';
export const DELETE_RESULT = 'DELETE_RESULT';
```

```js
// src/store/reducer.js
import * as actionTypes from './actions'; // import actions

const initialState = {
  counter: 0,
  results: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INCREMENT:
      return {
        ...state,
        counter: state.counter + 1,
      };
    case actionTypes.DECREMENT:
    //...
    default:
      return state;
  }
};

export default reducer;
```

```js
// src/containers/Counter/Counter.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
//...
import * as actionTypes from '../../store/actions'; // import actions

class Counter extends Component {
  state = {
    counter: 0,
  };

  render() {
    return (
      <div>
        {...}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  //...
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIncrementCounter: () =>
      dispatch({
        type: actionTypes.INCREMENT, // using actionTypes
      }),
    //...
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

### 18. Combining Multiple Reducers

There is something else we do a lot as our application grows and that is **use multiple reducers**. Now, we only have one reducer with Redux, all actions in the end get funneled through one reducer! But Redux gives us an utility method we can use to combine multiple reducers into one, so that we still follow the pattern of having only one reducer behind the scenes. We can split up our code logically so that we dont get one huge reducer, imagine how this reducer would grow as we add more and more action types we want to handle. But that we can split it up by feature.

It might make sense to have a reducer which handles the counter and one which handles the results, even though they're somehow related, they technically are different or they manage different parts of the app so splitting it up might make sense.

Let's first create two separate reducers –

```js
// src/store/reducers/counter.js
import * as actionTypes from '../actions';

const initialState = {
  counter: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INCREMENT:
      return {
        ...state,
        counter: state.counter + 1,
      };
    case actionTypes.DECREMENT:
      return {
        ...state,
        counter: state.counter - 1,
      };
    case actionTypes.ADD:
      return {
        ...state,
        counter: state.counter + action.payload.value,
      };
    case actionTypes.SUBSTRACT:
      return {
        ...state,
        counter: state.counter - action.payload.value,
      };
    default:
      return state;
  }
};

export default reducer;
```

```js
// src/store/reducers/result.js
import * as actionTypes from '../actions';

const initialState = {
  results: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.STORE_RESULT:
      return {
        ...state,
        results: state.results.concat({ value: state.counter, id: new Date() }), // push manipulates the original value... we use concat which is the immutable way of doing it
      };
    case actionTypes.DELETE_RESULT:
      // filter returns a new array!!
      const updatedArray = state.results.filter(
        (result) => result.id !== action.payload.id,
      );
      return {
        ...state,
        results: updatedArray,
      };
    default:
      return state;
  }
};

export default reducer;
```

Now to combine them, we need to import a helper function from the Redux package, it's called `combineReducers`, as the name suggests, this is a function which takes a JavaScript object mapping our reducers to different slices of our state as input and merges everything into one state and one reducer for us.

```js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux'; // import combineReducers
import { Provider } from 'react-redux';

import counterReducer from './store/reducers/counter'; // import counterReducer
import resultReducer from './store/reducers/result'; // import resultReducer
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// create a rootReducer
const rootReducer = combineReducers({
  ctr: counterReducer,
  res: resultReducer,
});

const store = createStore(rootReducer); // pass the rootReducer in the createStore function

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
```

But we got a problem... the problem is that stored `results` where we map through all the stored results, that this won't work because this props stored results now refers to `undefined` and not to an array of results anymore. This happens due to us combining reducers, we will have one state in the end.

To avoid naming conflicts, Redux adds one level of nesting where it has one state object but basically with these keys here, in combined reducers as properties which give us access to these sub states for these feature areas.

```js
// src/containers/Counter/Counter.js
//...
const mapStateToProps = (state) => {
  return {
    // ctr: state.counter, // BEFORE
    ctr: state.ctr.counter, // NOW
    // storedResults: state.results, // BEFORE
    storedResults: state.res.results, // NOW
  };
};
//...
```

We have another problem, in `resultReducer`, we need to the counter state... But we don't have access to it. The reason for this is that inside this reducer function, it basically has no access to the global state only to that state of that reducer function.

That's different than the counter component where we connect our React component to the global state, there we can access the different pieces of the state through our slices we set up in `index.js`. We should simply get it as an action payload and this is generally how your reducers work anyways most of the time, it's old state plus action plus optionally action data and you return a new state.

```js
// src/store/reducers/result.js
//...
 case actionTypes.STORE_RESULT:
  return {
    ...state,
    results: state.results.concat({
      value: action.payload.result, // using action payload
      id: new Date(),
    }),
  };
//...
```

```js
// src/containers/Counter/Counter.js
//...
<button onClick={() => this.props.onStoreResult(this.props.ctr)}>
  Store Result
</button>
//...
onStoreResult: (result) =>
  dispatch({
    type: actionTypes.STORE_RESULT,
    payload: {
      result, // passing a result
    },
  }),
//...
```

### 19. Understanding State Types

Should every state be handled through Redux?

Because in the demo application in this module, we eliminated the setState call in the component and we eliminated the local component state, the state we used thus far in all React applications and projects we built in this course. Instead we used the Redux state and action dispatching and store binding to use that state. Is this always the approach you should follow? Do you always have to use redux to begin with?

Well the question whether you use Redux or not **depends on the size of our application** and the **complexity of our state**.

We have a simple, a small application, setting up Redux might take us longer than the benefits we get out of it are worth it. For any decent medium size or big application, using Redux and managing the state there is probably a good idea but then still, we have to ask which state should be used for Redux because we shouldn't necessarily manage all the state in it.

![types-of-state](../img/s14/14-5-types-of-state.png 'types-of-state')

### 20. Assignment 5 – Redux Basics

1. Install the packages

```sh
yarn add redux
yarn add react-redux
```

2. Connecting React to Redux (via `index.js`)

```js
// redux-assignment-2-problem/src/index.js
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
```

3. Connecting the Store to React

Look at the `Provider` above and then, we **subscribe** via `connect` in our container `Persons` below.

```js
// redux-assignment-2-problem/src/containers/Persons.js
import React, { Component } from 'react';
import { connect } from 'react-redux'; // 6 – import `connect` from `react-redux`

import Person from '../components/Person/Person';
import AddPerson from '../components/AddPerson/AddPerson';
import * as actionTypes from '../store/actions'; // 12 – import `actionTypes` from the store

class Persons extends Component {
  state = {
    persons: [],
  };

  render() {
    return (
      <div>
        <AddPerson personAdded={this.props.personAddedHandler} />
        {this.props.persons.map((person) => (
          <Person
            key={person.id}
            name={person.name}
            age={person.age}
            clicked={() => this.props.personDeletedHandler(person.id)}
          />
        ))}
      </div>
    );
  }
}

// 8 – create a mapStateToProps constant to get access to the state we want
const mapStateToProps = (state) => {
  return {
    persons: state.persons,
  };
};

// 10 – create a mapStateToProps constant to dispatch actions to the reducer
const mapDispatchToProps = (dispatch) => {
  return {
    personAddedHandler: () =>
      dispatch({
        type: actionTypes.ADD_PERSON,
      }),
    personDeletedHandler: (id) =>
      dispatch({
        type: actionTypes.DELETE_PERSON,
        payload: {
          id,
        },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Persons);

// 7 – (below) use the HOC `connect` to set up the subscription to our newly created store
// export default connect()(Persons);

// 9 – (below) add mapStateToProps (as a first param in connect)
// export default connect(mapStateToProps)(Persons);

// 11 – (below) add mapDispatchToProps (as a second param in connect)
// export default connect(mapStateToProps, mapDispatchToProps)(Persons);
```

And here is our reducer :)

```js
// redux-assignment-2-problem/src/store/reducer.js
import * as actionTypes from './actions';

const initialState = {
  persons: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_PERSON:
      const newPerson = {
        id: Math.random(), // not really unique but good enough here!
        name: 'Max',
        age: Math.floor(Math.random() * 40),
      };
      return {
        ...state,
        persons: state.persons.concat(newPerson),
      };
    case actionTypes.DELETE_PERSON:
      return {
        ...state,
        persons: state.persons.filter(
          (person) => person.id !== action.payload.id,
        ),
      };
    default:
      return state;
  }
};

export default reducer;
```

### 21. Combining Local UI State and Redux

Let's get back to our assignment and here we want to provide a name and an age when we create a new person. First, let's add two input fields

```js
// redux-assignment-2-problem/src/components/AddPerson/AddPerson.js
import React from 'react';

import './AddPerson.css';

const addPerson = (props) => (
  <div className="AddPerson">
    <input type="text" placeholder="Name" />
    <input type="number" placeholder="Age" />
    <button onClick={props.personAdded}>Add Person</button>
  </div>
);

export default addPerson;
```

First, we need to change the component into class based component (or using `useState`) to manage state.

```js
// redux-assignment-2-problem/src/components/AddPerson/AddPerson.js
import React, { Component } from 'react';

import './AddPerson.css';

class AddPerson extends Component {
  state = {
    name: '',
    age: null,
  };

  nameChangedHandler = (event) => {
    this.setState({ name: event.target.value });
  };

  ageChangedHandler = (event) => {
    this.setState({ age: event.target.value });
  };

  render() {
    return (
      <div className="AddPerson">
        <input
          type="text"
          placeholder="Name"
          onChange={this.nameChangedHandler}
          value={this.state.name}
        />
        <input
          type="number"
          placeholder="Age"
          onChange={this.ageChangedHandler}
          value={this.state.age}
        />
        <button onClick={this.props.personAdded}>Add Person</button>
      </div>
    );
  }
}

export default AddPerson;
```

This is a typical use case of local UI state we could say. Whatever the user entered into these inputs probably isn't relevant to the entire application, there is no need to store this in the global Redux store. We can absolutely store it in the state of that component because it only matters to that component but it does matter to the other components as soon as this button is clicked.

```js
// redux-assignment-2-problem/src/containers/Persons.js
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Person from '../components/Person/Person';
import AddPerson from '../components/AddPerson/AddPerson';
import * as actionTypes from '../store/actions';

class Persons extends Component {
  state = {
    persons: [],
  };

  render() {
    return (
      <div>
        <AddPerson personAdded={this.props.personAddedHandler} />
        {this.props.persons.map((person) => (
          <Person
            key={person.id}
            name={person.name}
            age={person.age}
            clicked={() => this.props.personDeletedHandler(person.id)}
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    persons: state.persons,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    personAddedHandler: (name, age) =>
      dispatch({
        type: actionTypes.ADD_PERSON,
        payload: {
          name, // ADD
          age, // ADD
        },
      }),
    personDeletedHandler: (id) =>
      dispatch({
        type: actionTypes.DELETE_PERSON,
        payload: {
          id,
        },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Persons);
```

```js
// redux-assignment-2-problem/src/store/reducer.js
import * as actionTypes from './actions';

const initialState = {
  persons: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_PERSON:
      const newPerson = {
        id: Math.random(), // not really unique but good enough here!
        name: action.payload.name,
        age: action.payload.age,
      };
      return {
        ...state,
        persons: state.persons.concat(newPerson),
      };
    case actionTypes.DELETE_PERSON:
      return {
        ...state,
        persons: state.persons.filter(
          (person) => person.id !== action.payload.id,
        ),
      };
    default:
      return state;
  }
};

export default reducer;
```
