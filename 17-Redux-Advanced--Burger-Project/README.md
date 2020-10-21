# Redux Advanced: Burger Project

### 1. Introduction

We're going to add Redux for handling our orders, for fetching them from the server for example and we'll also optimize our reducers a little bit with all the tools we learned about.

### 2. Installing the Redux Devtools

Let's add the Redux devtools to our project, following these [instructions](https://github.com/zalmoxisus/redux-devtools-extension).

```js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reducer from './store/reducer';

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
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
```

### 3. Preparing the Folder Structure

In the `store` folder, we have `actions` and `reducers` –

```sh
store/
├── actions/
│   ├── actionTypes.js
│   ├── burgerBuilder.js
│   └── order.js
└── reducers/
    ├── burgerBuilder.js
    └── order.js
```

### 4. Creating Action Creators

```js
// src/store/actions/index.js
export { addIngredient, removeIngredient } from './burgerBuilder';
export {} from './order';
```

```js
// src/store/actions/actionTypes.js
export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const REMOVE_INGREDIENT = 'REMOVE_INGREDIENT';
```

```js
// src/store/actions/burgerBuilder.js
import * as actionTypes from './actionTypes';

export const addIngredient = (name) => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    payload: {
      ingredientName: name,
    },
  };
};

export const removeIngredient = (name) => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    payload: {
      ingredientName: name,
    },
  };
};
```

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
import * as burgerBuilderActions from '../../store/actions/index';
//...
const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingName) => {
      dispatch(burgerBuilderActions.addIngredient(ingName)); // dispatch via the action creator
    },
    onIngredientRemoved: (ingName) =>
      dispatch(burgerBuilderActions.removeIngredient(ingName)), // dispatch via the action creator
  };
};
//...
```

### 5. Executing Asynchronous Code

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
//...
componentDidMount() {
  // axios
  //   .get('/ingredients.json')
  //   .then((response) => {
  //     console.log('response: ', response);
  //     this.setState({ ingredients: response.data });
  //   })
  //   .catch((error) => {
  //     console.log('error: ', error);
  //     this.setState({ error: true });
  //   });
}
//...
```

Now this is the time to fetch this again and there are two routes we can take,

1. we could uncomment the code above and leave it in the `componentDidMount` where we reach out to our firebase backend. And instead of calling `this.setState` here, we could dispatch an action which updates our ingredients in the Redux store. Then we would run the async code in our component and we wouldn't need action creators at all because we just dispatch normal actions at the end once the response is there. That is perfectly fine to do!

2. using **action creators**, the idea behind action creators is that we can still put our async code into the Redux world and as we saw earlier, this is the route we want to take here. Let's first install `redux-thunk`.

```sh
yarn add redux-thunk
```

```js
// src/index.js
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
```

_Note: Keep in mind, `compose` allows us to compose our own set of **enhancers** and **middleware** is just one kind of enhancer, the dev tools would be another example._

### 6. Fetching Ingredients Asynchronously

Let's create `initIngredients` where we fetch ingredients. We want to do this initially to load the ingredients we can use in the burger builder.

We don't expect any arguments on this function and we want to of course return an action ultimately, though to be precise... we want to return a function where we receive the `dispatch` function which we then can use in this function body and this is available, the syntax due to `redux-thunk` which allows us to use our action creators like this. Then we can execute async code and dispatch a new action whenever we're done.

So we actually need a second action creator which we only use it internally in this file, we'll name this action creator setIngredients. We expect to get ingredients as an argument and here, we will just return an action we want to dispatch.

```js
// src/store/actions/burgerBuilder.js
//...
export const setIngredients = (ingredients) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    payload: {
      ingredients,
    },
  };
};

export const fetchIngredientsFailed = () => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED,
  };
};

export const initIngredient = () => {
  return (dispatch) => {
    axios
      .get('/ingredients.json')
      .then((response) => {
        dispatch(setIngredients(response.data));
      })
      .catch((error) => {
        console.log('error: ', error);
        dispatch(fetchIngredientsFailed());
      });
  };
};
//...
```

### 7. Initializing Ingredients in the BurgerBuilder

```js
// src/store/reducers/burgerBuilder.js
//...
case actionTypes.SET_INGREDIENTS:
  return {
    ...state,
    ingredients: action.payload.ingredients,
    error: false,
  };
case actionTypes.FETCH_INGREDIENTS_FAILED:
  return {
    ...state,
    error: true,
  };
default:
  return state;
//...
```

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as burgerBuilderActions from '../../store/actions/index';
//...

export class BurgerBuilder extends Component {
  state = {
    purchasing: false,
  };

  componentDidMount() {
    this.props.onInitIngredients(); // call onInitIngredients
  }

  //...

  render() {
    //...
    if (!ings) {
      // now use the props.error from our store
      burger = this.props.error ? (
        <p>Ingredients can't be loaded</p>
      ) : (
        <Spinner />
      );
      orderSummary = <Spinner />;
    }
    return (
      //...
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.ingredients,
    totalPrice: state.totalPrice,
    error: state.error, // add the error from our store
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingName) =>
      dispatch(burgerBuilderActions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) =>
      dispatch(burgerBuilderActions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(burgerBuilderActions.initIngredient()), // initIngredient added
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withErrorHandler(BurgerBuilder, axios));
```

### 8. Changing the Order of our Ingredients Manually

We could create object with the type of ingredients, the quantity and also the order of each element... But this is not very important.

### 9. Adding Order Actions

```js
// src/store/actions/order.js
import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (id, orderData) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    payload: {
      orderId: id,
      orderData,
    },
  };
};

export const purchaseBurgerFail = (error) => {
  return {
    type: actionTypes.PURCHASE_BURGER_FAIL,
    payload: {
      error,
    },
  };
};

export const purchaseBurgerStart = (orderData) => {
  return (dispatch) => {
    axios
      .post('/orders.json', orderData)
      .then((response) => {
        dispatch(purchaseBurgerSuccess(response.data.name, orderData));
      })
      .catch((error) => {
        console.log('error: ', error);
        dispatch(purchaseBurgerFail(error));
      });
  };
};
```

### 10. Connecting Contact Data Container & Actions

```js
// src/containers/Checkout/ContactData/ContactData.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
//...
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'; // add
import * as actions from '../../../store/actions/index'; // add

class ContactData extends Component {
  state = {
    //...
  };

  orderHandler = (event) => {
    event.preventDefault();

    const formData = {};
    for (const formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[
        formElementIdentifier
      ].value;
    }

    const order = {
      ingredients: this.props.ings,
      price: this.props.totalPrice,
      orderData: formData,
    };

    this.props.onOrderBurger(order); // call onOrderBurger in here
  };

  //...

  render() {
    const formElementsArray = [];
    for (const key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key],
      });
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map(({ id, config }) => (
          <Input
            key={id}
            elementType={config.elementType}
            elementConfig={config.elementConfig}
            value={config.value}
            invalid={!config.valid}
            shouldValidate={config.validation}
            touched={config.touched}
            changed={(event) => this.inputChangedHandler(event, id)}
          />
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>
          ORDER
        </Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }

    return (
      <div className={classes.ContactData}>
        <h4>Enter you Contact Data</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.ingredients,
    totalPrice: state.totalPrice,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onOrderBurger: (orderData) =>
      dispatch(actions.purchaseBurgerStart(orderData)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withErrorHandler(ContactData, axios)); // add withErrorHandler (and don't forget to pass axios)
```

### 11. The Order Reducer

```js
// src/store/reducers/order.js
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  orders: [],
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PURCHASE_BURGER_SUCCESS:
      const newOrder = {
        ...action.payload.orderData,
        id: action.payload.orderId,
      };
      return {
        ...state,
        loading: false,
        orders: state.orders.concat(newOrder),
      };
    case actionTypes.PURCHASE_BURGER_FAIL:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;
```

### 12. Working on Order Actions

We've just add a _loading_ action creator called `purchaseBurgerStart`, as below:

```js
// src/store/actions/order.js
import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (id, orderData) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    payload: {
      orderId: id,
      orderData,
    },
  };
};

export const purchaseBurgerFail = (error) => {
  return {
    type: actionTypes.PURCHASE_BURGER_FAIL,
    payload: {
      error,
    },
  };
};

// it is going to be the loading information (look at the reducer for more details)
export const purchaseBurgerStart = () => {
  return {
    type: actionTypes.PURCHASE_BURGER_START,
  };
};

export const purchaseBurger = (orderData) => {
  return (dispatch) => {
    dispatch(purchaseBurgerStart());
    axios
      .post('/orders.json', orderData)
      .then((response) => {
        dispatch(purchaseBurgerSuccess(response.data.name, orderData));
      })
      .catch((error) => {
        console.log('error: ', error);
        dispatch(purchaseBurgerFail(error));
      });
  };
};
```

```js
// src/store/reducers/order.js
//...
case actionTypes.PURCHASE_BURGER_START:
  return {
    ...state,
    loading: true,
  };
//...
```

### 13. Redirect to Improve UX

```js
// src/containers/Checkout/Checkout.js
import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

export class Checkout extends Component {
  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  };

  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  };

  render() {
    const { ings } = this.props;
    let summary = <Redirect to="/" />;
    if (ings) {
      summary = (
        <React.Fragment>
          <CheckoutSummary
            ingredients={ings}
            checkoutCancelled={this.checkoutCancelledHandler}
            checkoutContinued={this.checkoutContinuedHandler}
          />
          <Route
            path={`${this.props.match.path}/contact-data`}
            component={ContactData}
          />
        </React.Fragment>
      );
    }
    return summary;
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.ingredients,
  };
};

export default connect(mapStateToProps)(Checkout);
```

### 14. Combining Reducers

```js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'; // 1 – import `combineReducers` from `redux`
import thunk from 'redux-thunk';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import burgerBuilderReducer from './store/reducers/burgerBuilder';
import orderReducer from './store/reducers/order'; // 2 – import our orderReducer

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// 3 – let's create a rootReducer where we combine our reducers
const rootReducer = combineReducers({
  burgerBuilder: burgerBuilderReducer,
  order: orderReducer,
});

// 4 – and now pass the rootreducer as first arg in the createStore
const store = createStore(
  rootReducer,
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
```

And now we need to amend our `mapStateToProps` (here is an example below). We need to access the right slice of state, because now we're combining our reducers.

```js
// src/containers/Checkout/ContactData/ContactData.js
//...
const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients, // add `burgerBuilder`
    totalPrice: state.burgerBuilder.totalPrice, // add `burgerBuilder`
    loading: state.order.loading, // add `order`
  };
};
//...
```

### 15. Handling Purchases & Updating the UI

We never get **redirected** once we placed an order. There are various ways of implementing redirection, one thing is we could **pass a reference to that router history prop onto our order action creator** and when we dispatch burger success or fail, or at least for the success case, we could then use that if we receive it as an argument in this function to call the push method on it... but this is not great (even if we can definitely do that).

The approach we'll use is a Redux only approach, we'll add a new action type to the action types file `PURCHASE_INIT`.

```js
// src/store/actions/actionTypes.js
//...
export const PURCHASE_INIT = 'PURCHASE_INIT'; // 1 – add a new action type `PURCHASE_INIT`
//...
```

```js
// src/store/actions/order.js
//...
// 2 – create a new action creator `purchaseInit` where we only return the action type `PURCHASE_INIT`
export const purchaseInit = () => {
  return {
    type: actionTypes.PURCHASE_INIT,
  };
};
//...
```

```js
// src/store/actions/index.js
export {
  addIngredient,
  removeIngredient,
  initIngredient,
} from './burgerBuilder';
export { purchaseBurger, purchaseInit } from './order'; // 3 – export purchaseInit to get access to it
```

```js
// src/containers/Checkout/Checkout.js
import React, { Component } from 'react';
//...
import * as actions from '../../store/actions/index'; // 1 – import actions

export class Checkout extends Component {
  // 4 – add `componentWillMount` and call `this.props.onInitPurchase()`
  componentWillMount() {
    this.props.onInitPurchase();
  }

  //...

  render() {
    const { ings } = this.props;
    let summary = <Redirect to="/" />;
    if (ings) {
      // 6 – check if purchased
      const purchasedRedirect = this.props.purchased ? (
        <Redirect to="/" />
      ) : null;
      summary = (
        <React.Fragment>
          {purchasedRedirect}
          {...}
        </React.Fragment>
      );
    }
    return summary;
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    purchased: state.order.purchased, // 5 – get purchased value from the store
  };
};

// 2 – create `mapDispatchToProps` and return `onInitPurchase` which dispatch `onInitPurchase`
const mapDispatchToProps = (dispatch) => {
  return {
    onInitPurchase: () => {
      dispatch(actions.purchaseInit());
    },
  };
};

// 3 – don't forget to add `mapDispatchToProps` to connect
export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
```

### 16. Resetting the Price after Purchases

```js
// src/containers/Checkout/Checkout.js
import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
//...

export class Checkout extends Component {
  //...
  render() {
    const { ings } = this.props;
    let summary = <Redirect to="/" />;
    if (ings) {
      // using purchased to know if we bought it/submit the form and redirect
      const purchasedRedirect = this.props.purchased ? (
        <Redirect to="/" />
      ) : null;
      summary = (
        <React.Fragment>
          {purchasedRedirect}
          <CheckoutSummary
            ingredients={ings}
            checkoutCancelled={this.checkoutCancelledHandler}
            checkoutContinued={this.checkoutContinuedHandler}
          />
          <Route
            path={`${this.props.match.path}/contact-data`}
            component={ContactData}
          />
        </React.Fragment>
      );
    }
    return summary;
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    purchased: state.order.purchased, // add (+ see reducer)
  };
};

export default connect(mapStateToProps)(Checkout);
```

### 17. Fetching Orders (via Redux)

1. Create the action types

```js
// src/store/actions/actionTypes.js
//...
export const FETCH_ORDERS_START = 'FETCH_ORDERS_START';
export const FETCH_ORDERS_SUCCESS = 'FETCH_ORDERS_SUCCESS';
export const FETCH_ORDERS_FAIL = 'FETCH_ORDERS_FAIL';
//...
```

2. Create the action creators

```js
// src/store/actions/order.js
//...
export const fetchOrdersSuccess = (orders) => {
  return {
    type: actionTypes.FETCH_ORDERS_SUCCESS,
    payload: {
      orders,
    },
  };
};

export const fetchOrdersFail = (error) => {
  return {
    type: actionTypes.FETCH_ORDERS_FAIL,
    payload: {
      error,
    },
  };
};

export const fetchOrdersStart = () => {
  return {
    type: actionTypes.FETCH_ORDERS_START,
  };
};

export const fetchOrders = () => {
  return (dispatch) => {
    dispatch(fetchOrdersStart());
    axios
      .get('/orders.json')
      .then(({ data }) => {
        const fetchedOrders = [];
        for (const key in data) {
          fetchedOrders.push({ ...data[key], id: key });
        }
        dispatch(fetchOrdersSuccess(fetchedOrders));
      })
      .catch((error) => {
        dispatch(fetchOrdersFail(error));
      });
  };
};
//...
```

3. Handle these new actions in the reducer too and create new cases

```js
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  orders: [],
  loading: false,
  purchased: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PURCHASE_INIT:
      return {
        ...state,
        purchased: false,
      };
    case actionTypes.FETCH_ORDERS_START: // add
    case actionTypes.PURCHASE_BURGER_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.PURCHASE_BURGER_SUCCESS:
      const newOrder = {
        ...action.payload.orderData,
        id: action.payload.orderId,
      };
      return {
        ...state,
        loading: false,
        orders: state.orders.concat(newOrder),
        purchased: true,
      };
    case actionTypes.PURCHASE_BURGER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case actionTypes.FETCH_ORDERS_SUCCESS: // add
      return {
        ...state,
        loading: false,
        orders: action.payload.orders,
      };
    case actionTypes.FETCH_ORDERS_FAIL: // add
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default reducer;
```

4. Export the fetchOrders action in the `index.js` file

```js
// src/store/actions/index.js
export {
  addIngredient,
  removeIngredient,
  initIngredient,
} from './burgerBuilder';
export { purchaseBurger, purchaseInit, fetchOrders } from './order';
```

5. Connect our application – we want to dispatch the new `fetchOrders` action we've just created (in the `componentDidMount`)

```js
// src/containers/Orders/Orders.js
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

export class Orders extends Component {
  componentDidMount() {
    this.props.onFetchOrders();
  }

  render() {
    let orders = <Spinner />;
    if (!this.props.loading) {
      orders = (
        <div>
          {this.props.orders.map((order) => (
            <Order
              key={order.id}
              ingredients={order.ingredients}
              price={order.price}
            />
          ))}
        </div>
      );
    }
    return orders;
  }
}

const mapStateToProps = (state) => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchOrders: () => dispatch(actions.fetchOrders()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withErrorHandler(Orders, axios));
```

### 18. Refactoring Reducers

```js
// src/store/utilty.js
export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};
```

```js
// src/store/reducers/burgerBuilder.js
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utilty';

const initialState = {
  ingredients: null,
  totalPrice: 4,
  error: false,
};

const INGREDIENT_PRICE = {
  salad: 0.5,
  bacon: 0.7,
  cheese: 0.4,
  meat: 1.3,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      const updatedIngredientAI = {
        [action.payload.ingredientName]:
          state.ingredients[action.payload.ingredientName] + 1,
      };
      const updatedIngredientsAI = updateObject(
        state.ingredients,
        updatedIngredientAI,
      );
      const updatedStateAI = {
        ingredients: updatedIngredientsAI,
        totalPrice:
          state.totalPrice + INGREDIENT_PRICE[action.payload.ingredientName],
      };
      return updateObject(state, updatedStateAI);
    case actionTypes.REMOVE_INGREDIENT:
      const updatedIngredientRI = {
        [action.payload.ingredientName]:
          state.ingredients[action.payload.ingredientName] - 1,
      };
      const updatedIngredientsRI = updateObject(
        state.ingredients,
        updatedIngredientRI,
      );
      const updatedStateRI = {
        ingredients: updatedIngredientsRI,
        totalPrice:
          state.totalPrice + INGREDIENT_PRICE[action.payload.ingredientName],
      };
      return updateObject(state, updatedStateRI);
    case actionTypes.SET_INGREDIENTS:
      return updateObject(state, {
        ingredients: action.payload.ingredients,
        totalPrice: 4,
        error: false,
      });
    case actionTypes.FETCH_INGREDIENTS_FAILED:
      return updateObject(state, { error: true });
    default:
      return state;
  }
};

export default reducer;
```

```js
// src/store/reducers/order.js
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utilty';

const initialState = {
  orders: [],
  loading: false,
  purchased: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PURCHASE_INIT:
      return updateObject(state, { purchased: false });
    case actionTypes.FETCH_ORDERS_START:
    case actionTypes.PURCHASE_BURGER_START:
      return updateObject(state, { loading: true });
    case actionTypes.PURCHASE_BURGER_SUCCESS:
      const newOrder = updateObject(action.payload.orderData, {
        id: action.payload.orderId,
      });

      return updateObject(state, {
        loading: false,
        orders: state.orders.concat(newOrder),
        purchased: true,
      });
    case actionTypes.FETCH_ORDERS_FAIL:
    case actionTypes.PURCHASE_BURGER_FAIL:
      return updateObject(state, {
        loading: false,
        error: action.payload.error,
      });
    case actionTypes.FETCH_ORDERS_SUCCESS:
      return updateObject(state, {
        loading: false,
        orders: action.payload.orders,
      });
    default:
      return state;
  }
};

export default reducer;
```

### 19. Refactoring Reducers Continued

The one thing we can also do is we can extract the logic from our cases into their own functions so that our switch case statement becomes very short. So in the reducer here, we can add a new constant which we could name `addIngredient`, so basically the action type will handle, this is a function which receives the state and the action just like the reducer itself does but there we only want to handle this code.

```js
// src/store/reducers/burgerBuilder.js
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utilty';

//...

// all the logic to add an ingredient
const addIngredient = (state, action) => {
  const updatedIngredientAI = {
    [action.payload.ingredientName]:
      state.ingredients[action.payload.ingredientName] + 1,
  };
  const updatedIngredientsAI = updateObject(
    state.ingredients,
    updatedIngredientAI,
  );
  const updatedStateAI = {
    ingredients: updatedIngredientsAI,
    totalPrice:
      state.totalPrice + INGREDIENT_PRICE[action.payload.ingredientName],
  };
  return updateObject(state, updatedStateAI);
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      return addIngredient(state, action); // very short now
    case actionTypes.REMOVE_INGREDIENT:
    //...
    default:
      return state;
  }
};

export default reducer;
```
