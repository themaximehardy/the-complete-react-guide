# Adding Redux to our Project

### 1. Introduction

Let's add Redux in our project. But first, we're going to analyse our existing project to find out what kind of state we want to manage through Redux.

Let's dive into our containers because thankfully, we already have a structure where all state management takes place in containers. Therefore we don't need to dig through all the components, it's really just state we manage in containers we probably want to manage via Redux in the future.

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
//...
state = {
  ingredients: null, // REDUX
  totalPrice: 4, // REDUX
  purchaseable: false, // Local UI state
  purchasing: false, // Local UI state
  loading: false, // Local UI state
  error: false, // Local UI state
};
//...
```

`purchasing`, `loading` and `error` are kind of local UI state. We use them to determine whether we show a modal, whether we show an error message. We could of course also manage these through Redux but there also might not be a necessity. `ingredients` and `totalPrice` are definitely interesting to manage via Redux. `purchaseable`, we use it to disable / enable a button, this is also more a UI state – it might not be super important for us to manage that through Redux.

```js
// src/containers/Checkout/Checkout.js
//...
state = {
  ingredients: null,
  totalPrice: 0,
};
//...
```

We have `ingredients` and `price` here, this already a strong case for using Redux because, we have that issue of passing the ingredients through query params and that would be awesome if we can get rid of that.

In `Orders` component, `orders` would be handle with http requests (=> we're going to see how to handle it with Redux later).

### 2. Installing Redux and React Redux

```sh
yarn add redux react-redux
```

Create our **actions**:

```js
// src/store/actions.js
export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const REMOVE_INGREDIENT = 'REMOVE_INGREDIENT';
```

```js
// src/store/reducer.js
import * as actionTypes from './actions';

const initialState = {
  ingredients: null,
  totalPrice: 4,
};

const reducer = (state = initialState, action) => {
  //...
};

export default reducer;
```

### 3. Basic Redux Setup

Is the `Provider` in the `index.js` should wrap the `BrowserRouter`? The answer is the `Provider` should wrap everything! There is also something special about using `react-redux` with the React router and we'll come back to that and how we fix this. It basically has to do with making sure that the connect functionality and the routing functionalities work well together because both implicitly set up some props on the wrapping component and we have to make sure that everything works.

```js
// src/index.js
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
```

### 4. Finishing the Reducer for Ingredients

```js
// src/store/reducer.js
import * as actionTypes from './actions';

const initialState = {
  ingredients: {
    salad: 0,
    bacon: 0,
    cheese: 0,
    meat: 0,
  },
  totalPrice: 4,
};

const reducer = (state = initialState, action) => {
  const { ingredientName } = action.payload;

  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: {
          ...state.ingredients, // we need to do it to get a deep copy in ingredients
          [ingredientName]: state.ingredients[ingredientName] + 1,
        },
      };
    case actionTypes.REMOVE_INGREDIENT:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [ingredientName]: state.ingredients[ingredientName] - 1,
        },
      };
    default:
      return state;
  }
};

export default reducer;
```

### 5. Connecting the Burger Builder Container to our Store

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
import React, { Component } from 'react';
import { connect } from 'react-redux'; // import `connect` from `react-redux`

import * as actionTypes from '../../store/actions'; // import actionTypes
//...
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

//...

export class BurgerBuilder extends Component {
  state = {
    totalPrice: 4, // base price $4
    purchaseable: false,
    purchasing: false,
    loading: false,
    error: false,
  };

  componentDidMount() {
    //...
  }

  //...

  render() {
    const { ings } = this.props; // get ingredients form the props now
    const disabledInfo = {
      ...ings,
    };
    for (const key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = (
      <OrderSummary
        price={this.state.totalPrice}
        ingredients={ings}
        purchaseCanceled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
      />
    );
    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    let burger = (
      <Aux>
        <Burger ingredients={ings} />
        <BuildControls
          price={this.state.totalPrice}
          purchaseable={this.state.purchaseable}
          ordered={this.purchaseHandler}
          ingredientAdded={this.props.onIngredientAdded} // use our dispatch method via props – onIngredientAdded
          ingredientRemoved={this.props.onIngredientRemoved} // use our dispatch method via props – onIngredientRemoved
          disabled={disabledInfo}
        />
      </Aux>
    );
    if (!ings) {
      burger = this.state.error ? (
        <p>Ingredients can't be loaded</p>
      ) : (
        <Spinner />
      );
      orderSummary = <Spinner />;
    }
    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

// add mapStateToProps
const mapStateToProps = (state) => {
  return {
    ings: state.ingredients,
  };
};

// add mapDispatchToProps
const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingName) =>
      dispatch({
        type: actionTypes.ADD_INGREDIENT,
        payload: {
          ingredientName: ingName,
        },
      }),
    onIngredientRemoved: (ingName) =>
      dispatch({
        type: actionTypes.REMOVE_INGREDIENT,
        payload: {
          ingredientName: ingName,
        },
      }),
  };
};

// use connect and passing mapStateToProps and mapDispatchToProps
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withErrorHandler(BurgerBuilder, axios));
```

### 6. Working on the Total Price Calculation

```js
// src/store/reducer.js
import * as actionTypes from './actions';

const initialState = {
  ingredients: {
    salad: 0,
    bacon: 0,
    cheese: 0,
    meat: 0,
  },
  totalPrice: 4,
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
      return {
        ...state,
        //...
        totalPrice:
          state.totalPrice + INGREDIENT_PRICE[action.payload.ingredientName],
      };
    case actionTypes.REMOVE_INGREDIENT:
      return {
        ...state,
        //...
        totalPrice:
          state.totalPrice - INGREDIENT_PRICE[action.payload.ingredientName],
      };
    default:
      return state;
  }
};

export default reducer;
```

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
// REPLACE `this.state.totalPrice` with `this.props.totalPrice`
//...
const mapStateToProps = (state) => {
  return {
    ings: state.ingredients,
    totalPrice: state.totalPrice,
  };
};
//...
```

### 7. Redux & UI State

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
//...

export class BurgerBuilder extends Component {
  state = {
    purchasing: false,
    loading: false,
    error: false,
  };

  //...

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map((igKey) => ingredients[igKey])
      .reduce((acc, cur) => {
        return acc + cur;
      }, 0);

    return sum > 0;
  }

  //...

  render() {
    //...
    let burger = (
      <Aux>
        <Burger ingredients={ings} />
        <BuildControls
          price={this.props.totalPrice}
          purchaseable={this.updatePurchaseState(this.props.ings)} // handle it differently
          ordered={this.purchaseHandler}
          ingredientAdded={this.props.onIngredientAdded}
          ingredientRemoved={this.props.onIngredientRemoved}
          disabled={disabledInfo}
        />
      </Aux>
    );
    //...
  }
}

//...

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withErrorHandler(BurgerBuilder, axios));
```

### 8. Adjusting Checkout and Concat Data

```js
// src/containers/Checkout/Checkout.js
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
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
    return (
      <div>
        {ings ? (
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
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.ingredients,
  };
};

export default connect(mapStateToProps)(Checkout);
```
