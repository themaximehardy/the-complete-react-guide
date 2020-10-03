# Adding Routing to our Burger Project

### 1. Introduction

Let's add routing an more pages to our app.

### 2. Building the Checkout Container

```js
// src/containers/Checkout/Checkout.js
import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';

export class Checkout extends Component {
  // currently, we just fake the state
  state = {
    ingredients: {
      salad: 1,
      bacon: 1,
      cheese: 1,
      meat: 1,
    },
  };
  render() {
    return (
      <div>
        <CheckoutSummary ingredients={this.state.ingredients} />
      </div>
    );
  }
}

export default Checkout;
```

```js
// src/components/Order/CheckoutSummary/CheckoutSummary.js
import React from 'react';
import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';
import classes from './CheckoutSummary.css';

const CheckoutSummary = (props) => {
  return (
    <div className={classes.CheckoutSummary}>
      <h1>We hope it tastes well!</h1>
      <div style={{ width: '100%', margin: 'auto' }}>
        <Burger ingredients={props.ingredients} />
      </div>
      <Button clicked btnType="Danger">
        CANCEL
      </Button>
      <Button clicked btnType="Success">
        CONTINUE
      </Button>
    </div>
  );
};

export default CheckoutSummary;
```

### 3. Setting Up Routing & Routes

```js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
//...

const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
```

```js
// src/App.js
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
//...

class App extends Component {
  render() {
    return (
      <Layout>
        <Switch>
          <Route path="/" exact component={BurgerBuilder} />
          <Route path="/checkout" component={Checkout} />
        </Switch>
      </Layout>
    );
  }
}

export default App;
```

### 4. Navigating to the Checkout Page

Important note: if we look at the `BurgerBuilder` component and we `console.log` the `props`... We're going to have access to `match`. But if we tried from `Burger` (which is a child of `BurgerBuilder`), we won't have access to it! While `Burger` is of course part of the routable area, it is not loaded through a route object, only `BurgerBuilder` is. Then only `BurgerBuilder` itself gets these special props. Components nested inside burger builder don't get them, **we would have to pass them on manually**.

But if we use a **special higher order component** provided by `react-router-dom`, we can actually inject / make them available these special props in any component. The higher order component is named `withRouter` and if we wrap our export with it, then, we also have `match` `location` and `history` and _match will refer to the nearest match_.

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
import React, { Component } from 'react';
//...

export class BurgerBuilder extends Component {
  //...
  purchaseContinueHandler = () => {
    this.props.history.push('/checkout'); // ADD
  };

  render() {
    //...
  }
}

export default withErrorHandler(BurgerBuilder, axios);
```

### 5. Navigating Back & To Next Page

```js
// src/containers/Checkout/Checkout.js
import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';

export class Checkout extends Component {
  state = {
    ingredients: {
      salad: 1,
      meat: 1,
      cheese: 1,
      bacon: 1,
    },
  };

  // ADD
  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  };

  // ADD
  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  };

  render() {
    return (
      <div>
        <CheckoutSummary
          ingredients={this.state.ingredients}
          checkoutCancelled={this.checkoutCancelledHandler}
          checkoutContinued={this.checkoutContinuedHandler}
        />
      </div>
    );
  }
}

export default Checkout;
```

### 6. Passing Ingredients via Query Params

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
import React, { Component } from 'react';
//...

export class BurgerBuilder extends Component {
  //...

  purchaseContinueHandler = () => {
    // manage query params / string
    const queryParams = [];
    for (const i in this.state.ingredients) {
      queryParams.push(
        encodeURIComponent(i) +
          '=' +
          encodeURIComponent(this.state.ingredients[i]),
      );
    }
    const queryString = queryParams.join('&');
    this.props.history.push({
      pathname: '/checkout',
      search: '?' + queryString,
    });
  };

  render() {
    //...
  }
}

export default withErrorHandler(BurgerBuilder, axios);
```

```js
// src/containers/Checkout/Checkout.js
import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';

export class Checkout extends Component {
  state = {
    ingredients: {
      salad: 1,
      meat: 1,
      cheese: 1,
      bacon: 1,
    },
  };

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    const ingredients = {};
    for (const param of query.entries()) {
      // ['salad', '1']
      ingredients[param[0]] = +param[1];
    }
    this.setState({ ingredients: ingredients });
  }

  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  };

  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  };

  render() {
    return (
      <div>
        <CheckoutSummary
          ingredients={this.state.ingredients}
          checkoutCancelled={this.checkoutCancelledHandler}
          checkoutContinued={this.checkoutContinuedHandler}
        />
      </div>
    );
  }
}

export default Checkout;
```

### 7. Navigating to the Contact Data Component

```js
// src/containers/Checkout/ContactData/ContactData.js
import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';

export class ContactData extends Component {
  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: '',
    },
  };

  render() {
    return (
      <div className={classes.ContactData}>
        <h4>Enter you Contact Data</h4>
        <form>
          <input
            className={classes.Input}
            type="text"
            name="name"
            placeholder="Your Name"
          />
          <input
            className={classes.Input}
            type="text"
            name="email"
            placeholder="Your Email"
          />
          <input
            className={classes.Input}
            type="text"
            name="street"
            placeholder="Street"
          />
          <input
            className={classes.Input}
            type="text"
            name="postal"
            placeholder="Postal"
          />
          <Button btnType="Success">ORDER</Button>
        </form>
      </div>
    );
  }
}

export default ContactData;
```

```js
// src/containers/Checkout/Checkout.js
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
//...

export class Checkout extends Component {
  //...

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    const ingredients = {};
    for (const param of query.entries()) {
      // ['salad', '1']
      ingredients[param[0]] = +param[1];
    }
    this.setState({ ingredients: ingredients });
  }

  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  };

  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  };

  render() {
    return (
      <div>
        <CheckoutSummary
          ingredients={this.state.ingredients}
          checkoutCancelled={this.checkoutCancelledHandler}
          checkoutContinued={this.checkoutContinuedHandler}
        />
        <Route
          path={`${this.props.match.path}/contact-data`}
          component={ContactData}
        />
      </div>
    );
  }
}

export default Checkout;
```

### 8. Order Submission & Passing Data Between Pages

We could send data via the React Router. If we replace `component` with `render` inside of `Route`. We could

```js
// src/containers/Checkout/Checkout.js
//...
// BEFORE
<Route path={`${this.props.match.path}/contact-data`} component={ContactData} />
// AFTER
// NB: we pass props to get access to the history (which we need in ContactData to redirect when we've send our request)
<Route
  path={`${this.props.match.path}/contact-data`}
  render={(props) => (
    <ContactData
      ingredients={this.state.ingredients}
      totalPrice={this.state.totalPrice}
      {...props}
    />
  )}
/>
//...
```

```js
// src/containers/Checkout/ContactData/ContactData.js
import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';

export class ContactData extends Component {
  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: '',
    },
    loading: false,
  };

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice,
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
        this.setState({ loading: false });
        this.props.history.push('/');
        console.log('response: ', response);
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log('error: ', error);
      });
  };

  render() {
    let form = (
      <form>
        <input
          className={classes.Input}
          type="text"
          name="name"
          placeholder="Your Name"
        />
        <input
          className={classes.Input}
          type="text"
          name="email"
          placeholder="Your Email"
        />
        <input
          className={classes.Input}
          type="text"
          name="street"
          placeholder="Street"
        />
        <input
          className={classes.Input}
          type="text"
          name="postal"
          placeholder="Postal"
        />
        <Button btnType="Success" clicked={this.orderHandler}>
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

export default ContactData;
```

### 9. Adding an Orders Page

```js
// src/components/Order/Order.js
import React from 'react';
import classes from './Order.css';

const Order = (props) => {
  return (
    <div className={classes.Order}>
      <p>Ingredients: Salad (1)</p>
      <p>
        Price: <strong>USD 5.45</strong>
      </p>
    </div>
  );
};

export default Order;
```

```js
// src/containers/Orders/Orders.js
import React, { Component } from 'react';
import Order from '../../components/Order/Order';

export class Orders extends Component {
  render() {
    return (
      <div>
        <Order />
        <Order />
      </div>
    );
  }
}

export default Orders;
```

```js
// src/App.js
import React, { Component } from 'react';
//...

class App extends Component {
  render() {
    return (
      <Layout>
        <Switch>
          <Route path="/" exact component={BurgerBuilder} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/orders" component={Orders} />
        </Switch>
      </Layout>
    );
  }
}

export default App;
```

### 10. Implementing Navigation Links

```js
// src/components/Navigation/NavigationItems/NavigationItems.js
import React from 'react';
import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const NavigationItems = () => {
  return (
    <ul className={classes.NavigationItems}>
      <NavigationItem link="/" exact>
        Burger&nbsp;Builder
      </NavigationItem>
      <NavigationItem link="/orders">Orders</NavigationItem>
    </ul>
  );
};

export default NavigationItems;
```

```js
// src/components/Navigation/NavigationItems/NavigationItem/NavigationItem.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import classes from './NavigationItem.css';

const NavigationItem = (props) => {
  return (
    <li className={classes.NavigationItem}>
      <NavLink
        to={props.link}
        exact={props.exact}
        activeClassName={classes.active}
      >
        {props.children}
      </NavLink>
    </li>
  );
};

export default NavigationItem;
```

_Note: when using CSS module, we need to use `activeClassName={classes.active}` to get the active class (automatically generated by Webpack)._

### 11. Fetching Orders

```js
// src/containers/Orders/Orders.js
import React, { Component } from 'react';
import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

export class Orders extends Component {
  state = {
    orders: [],
    loading: true,
  };

  componentDidMount() {
    axios
      .get('/orders.json')
      .then(({ data }) => {
        this.setState({ loading: false });
        const fetchedOrders = [];
        for (const key in data) {
          fetchedOrders.push({ ...data[key], id: key });
        }
        this.setState({ orders: fetchedOrders });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  }

  render() {
    return (
      <div>
        <Order />
        <Order />
      </div>
    );
  }
}

export default withErrorHandler(Orders, axios);
```

### 12. Outputting the Orders

```js
// src/containers/Orders/Orders.js
import React from 'react';
import classes from './Order.css';

const Order = (props) => {
  const ingredients = [];
  for (const ingredientName in props.ingredients) {
    ingredients.push({
      name: ingredientName,
      amount: props.ingredients[ingredientName],
    });
  }

  const ingredientOutput = ingredients.map((ingredient) => {
    return (
      <span
        key={ingredient.name}
        style={{
          textTransform: 'capitalize',
          display: 'inline-block',
          margin: '0 8px',
          border: '1px solid #ccc',
          padding: '5px',
        }}
      >
        {ingredient.name} ({ingredient.amount})
      </span>
    );
  });

  return (
    <div className={classes.Order}>
      <p>Ingredients: {ingredientOutput}</p>
      <p>
        Price: <strong>USD {Number.parseFloat(props.price.toFixed(2))}</strong>
      </p>
    </div>
  );
};

export default Order;
```
