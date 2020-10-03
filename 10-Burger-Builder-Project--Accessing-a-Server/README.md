# Burger Builder Project: Accessing a Server

### 1. Introduction

Let's store an order from the customer on a **server**. We'll implement the **backend** so that we can actually **store our orders** and also a way of retrieving them even after our page was reloaded. For that storing on the backend, we're going to use **Firebase**.

### 2. Firebase & The Right Database

Make sure we pick the **Realtime Database**, NOT **Firestore**!

### 3. Creating the Firebase Project

We're going to use Firebase as a dummy backend because it's easy to get started with it and for our needs here, it's free.

### 4. Creating the Axios Instance

```js
// src/axios-orders.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://url-abc123.firebaseio.com/',
});

export default instance;
```

### 5. Sending a POST Request

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
import React, { Component } from 'react';
//...
import axios from '../../axios-orders';
//...
export class BurgerBuilder extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0,
    },
    totalPrice: 4, // base price $4
    purchaseable: false,
    purchasing: false,
  };

  //...

  purchaseContinueHandler = () => {
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice, // should be done in the back end (just as an example here)
      customer: {
        name: 'John Smith',
        address: {
          street: '1 Red Street',
          zipcode: '973888',
          country: 'Burgerland',
        },
        email: 'john@smith.com',
      },
      deliveryMethod: 'fastest',
    };

    axios
      .post('/orders.json', order)
      .then((response) => {
        console.log('response: ', response);
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  };

  render() {
    //...
  }
}

export default BurgerBuilder;
```

### 6. Displaying a Spinner while Sending a Request

Let's go to [Single Element CSS Spinners](https://projects.lukehaas.me/css-loaders/) and choose a **spinner**.

```js
// src/components/UI/Spinner/Spinner.js
import React from 'react';
import classes from './Spinner.css';

const Spinner = () => {
  return <div className={classes.Loader}>Loading...</div>;
};

export default Spinner;
```

```css
.Loader,
.Loader:before,
.Loader:after {
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: load7 1.8s infinite ease-in-out;
  animation: load7 1.8s infinite ease-in-out;
}
.Loader {
  color: #944317;
  font-size: 10px;
  margin: 80px auto;
  position: relative;
  text-indent: -9999em;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
.Loader:before,
.Loader:after {
  content: '';
  position: absolute;
  top: 0;
}
.Loader:before {
  left: -3.5em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.Loader:after {
  left: 3.5em;
}
@-webkit-keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
@keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
```

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
import React, { Component } from 'react';
//...
import Spinner from '../../components/UI/Spinner/Spinner'; // ADD

//...

export class BurgerBuilder extends Component {
    //...
    loading: false, // ADD
  };

  //...

  purchaseContinueHandler = () => {
    this.setState({ loading: true }); // ADD
    const order = {
      //...
    };
    axios
      .post('/orders.json', order)
      .then((response) => {
        this.setState({ loading: false, purchasing: false }); // ADD – `purchasing: false` to close the Modal
        console.log('response: ', response);
      })
      .catch((error) => {
        this.setState({ loading: false, purchasing: false }); // ADD
        console.log('error: ', error);
      });
  };

  render() {
    const disabledInfo = {
      ...this.state.ingredients,
    };
    for (const key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = (
      <OrderSummary
        price={this.state.totalPrice}
        ingredients={this.state.ingredients}
        purchaseCanceled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
      />
    ); // ADD
    if (this.state.loading) {
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
        <Burger ingredients={this.state.ingredients} />
        {...}
      </Aux>
    );
  }
}

export default BurgerBuilder;
```

### 7. Handling Errors

We're going to create an HOC (but not as a component).

```js
// src/hoc/withErrorHandler/withErrorHandler.js
import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

const withErrorHandler = (WrappedComponent, axios) => {
  // we could do it also with a functional component (and not a class based component like here, we're going to see it later)
  return class extends Component {
    state = {
      error: null,
    };

    componentDidMount() {
      axios.interceptors.request.use((request) => {
        this.setState({ error: null });
        return request; // we don't have to forget to return the request (and the response!)!
      });
      axios.interceptors.response.use(
        (response) => response,
        (error) => {
          this.setState({ error: error });
        },
      );
    }

    errorConfirmedHandler = () => {
      this.setState({ error: null });
    };

    render() {
      const { error } = this.state;
      return (
        <Aux>
          <Modal show={!!error} modalClosed={this.errorConfirmedHandler}>
            {error ? error.message : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </Aux>
      );
    }
  };
};

export default withErrorHandler;
```

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
import React, { Component } from 'react';
//...
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

//...

export class BurgerBuilder extends Component {
  state = {
    //...
  };

  //...

  render() {
    //...
  }
}

export default withErrorHandler(BurgerBuilder, axios); // ADD the hoc here, and pass axios as a second argument
```

### 8. Retrieving Data from the Backend

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
import React, { Component } from 'react';
//...
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

//...

export class BurgerBuilder extends Component {
  state = {
    ingredients: null, // REMOVE the ingredients
    totalPrice: 4, // base price $4
    purchaseable: false,
    purchasing: false,
    loading: false,
    error: false,
  };

  componentDidMount() {
    // GET the ingredients from the server
    axios
      .get('https://url-abc123.firebaseio.com/ingredients.json')
      .then((response) => {
        console.log('response: ', response);
        this.setState({ ingredients: response.data });
      })
      .catch((error) => {
        console.log('error: ', error);
        this.setState({ error: true });
      });
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map((igKey) => ingredients[igKey])
      .reduce((acc, cur) => {
        return acc + cur;
      }, 0);

    this.setState({ purchaseable: sum > 0 });
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCounted = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCounted;
    const priceAddition = INGREDIENT_PRICE[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({ ingredients: updatedIngredients, totalPrice: newPrice });
    this.updatePurchaseState(updatedIngredients);
  };

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCounted = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCounted;
    const priceDeduction = INGREDIENT_PRICE[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({ ingredients: updatedIngredients, totalPrice: newPrice });
    this.updatePurchaseState(updatedIngredients);
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    this.setState({ loading: true });
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice, // should be done in the back end (just as an example here)
      customer: {
        name: 'John Smith',
        address: {
          street: '1 Red Street',
          zipcode: '973888',
          country: 'Burgerland',
        },
        email: 'john@smith.com',
      },
      deliveryMethod: 'fastest',
    };
    axios
      .post('/orders.json', order)
      .then((response) => {
        this.setState({ loading: false, purchasing: false });
        console.log('response: ', response);
      })
      .catch((error) => {
        this.setState({ loading: false, purchasing: false });
        console.log('error: ', error);
      });
  };

  render() {
    const disabledInfo = {
      ...this.state.ingredients,
    };
    for (const key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    // for example `disabledInfo`: {salad: true, meat: false,...}
    let orderSummary = (
      <OrderSummary
        price={this.state.totalPrice}
        ingredients={this.state.ingredients}
        purchaseCanceled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
      />
    );
    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    // handle the burger display (if ingredients, if error, if everything is ok)
    let burger = (
      <Aux>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          price={this.state.totalPrice}
          purchaseable={this.state.purchaseable}
          ordered={this.purchaseHandler}
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disabledInfo}
        />
      </Aux>
    );
    if (!this.state.ingredients) {
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

export default withErrorHandler(BurgerBuilder, axios);
```

### 9. Removing Old Interceptors

We could have **a lot of interceptors sitting in memory**, in the worst case, they lead to errors or do somehow change the state of our application but even in the best case, they **leak memory** because that's code that still runs that is not required anymore.

**We should remove the interceptors when the component gets unmounted**, when this specific instance of our `withErrorHandler` wrapper is not needed anymore and there actually is a lifecycle hook for this too, it's `componentWillUnmount`.

```js
// src/hoc/withErrorHandler/withErrorHandler.js
import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null,
    };

    componentDidMount() {
      // ADD a property / reference to be able to eject it when we `componentWillUnmount`
      this.reqInterceptor = axios.interceptors.request.use((request) => {
        this.setState({ error: null });
        return request;
      });
      this.resInterceptor = axios.interceptors.response.use(
        (response) => response,
        (error) => {
          this.setState({ error: error });
        },
      );
    }

    // ADD
    componentWillUnmount() {
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);
    }

    errorConfirmedHandler = () => {
      this.setState({ error: null });
    };

    render() {
      const { error } = this.state;
      return (
        <Aux>
          <Modal show={!!error} modalClosed={this.errorConfirmedHandler}>
            {error ? error.message : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </Aux>
      );
    }
  };
};

export default withErrorHandler;
```
