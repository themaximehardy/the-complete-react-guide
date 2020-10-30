# Adding Authentication to our Burger Project

_Useful Resources & Links_

- [SPA Authentication in general](https://stormpath.com/blog/token-auth-spa)
- [Firebase authentication REST API](https://firebase.google.com/docs/reference/rest/auth/)

### 1. Introduction

How the **authentication would work in a React SPA**? Single page application because if we have a **multi-page application** where **we render different pages for different requests** from our server, we **handle authentication in the traditional way** of having a **session** on the server and returning different pages after checking the validity of the user or the authentication status on the server.

The special thing about authentication in **React** is that **we have only one file and thereafter, we get no new file**... so we can check the authentication status of the user on the server but not on every request, at least not in the traditional model.

### 2. Understanding Authentication in Single Page Applications

So how does authentication work in SPA?

We have a server and we have our SPA running in the browser. Now the single page application sends the authentication data to the server because we probably have a sign up / a sign in page in our SPA and therefore we get data like the email address and the password and we send this to the server to validate it there because such logic obviously always has to happen on the server and this is also where we store our persistent data – in the database on the server – and the server doesn't have to be firebase as in our project of course. This can be any server, any restful API to be precise, this is what we typically communicate with when using single page applications.

That server then send something back and we could think that's a session. But since the server in a SPA world typically is a stateless restful API, we're not getting back a session because the server doesn't care about the different clients connecting to him. Instead we get back a token, we can think of that token as a JavaScript object and code it as JSON, JSON Web Tokens are the typical form of tokens we get. So it's a JavaScript object which has to be stored on the client, for example in local storage. We could also store it in our Redux store but there, it will be lost when ever the user refreshes the page... So we typically use local storage since that persists page refreshes and allows us to fetch that token even if the user did leave and revisit our page, so that we can leave the user are logged in if we want.

And what do we need this token for? Well, imagine we're making requests to some protected resource on the server, like for example we tried to change our password or we want to create a new blog post, such requests of course are only allowed to authenticated users and since we don't constantly check the authentication status on the server, we have no session there.

We pass the token along with requests to such protected resources, that token and that's important is created by the server and in a way that the server can verify if it's a valid token created by the server or not.

So that we can't fake such a token on the client, we can't create it there and send to the server, that would not work. Only the tokens sent by the server is accepted on the server.

![authentication](../img/s18/s18-1-authentication.png 'authentication')

### 3. Required App Adjustments

We need to add a new view, **the sign up and sign in view**, I'll combine it in one view where we can create new users or log users in.

We also want to **protect some routes** on the frontend, guard them so that for example we can't access the orders route if we're not authenticated.

And additionally, we also want to pass that token we'll receive onto the backend for requests to protect resources so that we can make sure that this does not work.

### 4. Adding an Auth Form

We repeat a lot of code form `ContactData` component but we're going to simplify it later in this course.

```js
// src/containers/Auth/Auth.js
import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Email',
        },
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password',
        },
        validation: {
          required: true,
          minLength: 6,
        },
        valid: false,
        touched: false,
      },
    },
  };

  checkValidity(value, rules) {
    let isValid = true;
    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }

    return isValid;
  }

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(
          event.target.value,
          this.state.controls[controlName].validation,
        ),
        touched: true,
      },
    };
    this.setState({ controls: updatedControls });
  };

  render() {
    const formElementsArray = [];
    for (const key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    const form = formElementsArray.map(({ id, config }) => (
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
    ));

    return (
      <div className={classes.Auth}>
        <form>
          {form}
          <Button btnType="Success">SUBMIT</Button>
        </form>
      </div>
    );
  }
}

export default Auth;
```

### 5. Adding Actions

```js
// src/store/actions/actionTypes.js
//...
export const AUTH_START = 'AUTH_START';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAIL = 'AUTH_FAIL';
```

```js
// src/store/actions/auth.js
import * as actionTypes from './actionTypes';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (authData) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    payload: {
      authData,
    },
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    payload: {
      error,
    },
  };
};

export const auth = (email, password) => {
  return (dispatch) => {
    dispatch(authStart()); // to be continued
  };
};
```

```js
// src/store/actions/index.js
//...
export { auth } from './auth';
```

```js
import React, { Component } from 'react';
import { connect } from 'react-redux'; // ADD
//...
import * as actions from '../../store/actions/index'; // ADD

class Auth extends Component {
  state = {
    //...
  };

  //...
  // ADD
  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
    );
  };

  render() {
    const formElementsArray = [];
    for (const key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    const form = formElementsArray.map(({ id, config }) => (
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
    ));

    return (
      <div className={classes.Auth}>
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">SUBMIT</Button>
        </form>
      </div>
    );
  }
}

// ADD mapDispatchToProps
const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password) => dispatch(actions.auth(email, password)),
  };
};

// ADD connect
export default connect(null, mapDispatchToProps)(Auth);
```

### 6. Getting a Token from the Backend

It's good to read [this page](https://firebase.google.com/docs/reference/rest/auth) to set up sign in with **FireBase**.

```sh
# .env
REACT_APP_FIREBASE_URL="https://url12345.firebaseio.com/"
REACT_APP_API_KEY="**********"
```

```js
// src/store/actions/auth.js
//...
export const auth = (email, password) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      email,
      password,
      returnSecureToken: true,
    };
    axios
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_API_KEY}`, // using .env
        authData,
      )
      .then((response) => {
        console.log('response: ', response);
        dispatch(authSuccess(response.data));
      })
      .catch((error) => {
        console.log('error: ', error);
        dispatch(authFail(error));
      });
  };
};
```

Note:

```js
// src/axios-orders.js
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_FIREBASE_URL, // best using .env
});

export default instance;
```

### 7. Adding Sign-In

We need to modify the front end with a button to switch between the signin / signup.

```js
// src/store/actions/auth.js
//...
export const auth = (email, password, isSignUp) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      email,
      password,
      returnSecureToken: true,
    };
    const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_API_KEY}`;
    const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_API_KEY}`;
    const url = isSignUp ? signUpUrl : signInUrl;
    axios
      .post(url, authData)
      .then((response) => {
        console.log('response: ', response);
        dispatch(authSuccess(response.data));
      })
      .catch((error) => {
        console.log('error: ', error);
        dispatch(authFail(error));
      });
  };
};
```

### 8. Storing the Token

We got the token and all that information when signing up and signing in, obviously **we want to store** this to be able in the future to also access resources on our server which are protected. Let's create a new reducer file.

```js
// src/store/reducers/auth.js
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utilty';

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
};

const authStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.payload.idToken,
    userId: action.payload.userId,
    error: null,
    loading: false,
  });
};

const authFail = (state, action) => {
  return updateObject(state, { error: action.payload.error, loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    default:
      return state;
  }
};

export default reducer;
```

```js
// src/store/actions/auth.js
import * as actionTypes from './actionTypes';
import axios from 'axios';

//...

export const authSuccess = (idToken, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    payload: {
      idToken,
      userId,
    },
  };
};

//...

export const auth = (email, password, isSignUp) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      email,
      password,
      returnSecureToken: true,
    };
    const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_API_KEY}`;
    const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_API_KEY}`;
    const url = isSignUp ? signUpUrl : signInUrl;
    axios
      .post(url, authData)
      .then((response) => {
        const { idToken, localId } = response.data;
        dispatch(authSuccess(idToken, localId));
      })
      .catch((error) => {
        console.log('error: ', error);
        dispatch(authFail(error));
      });
  };
};
```

```js
// src/index.js
//...
import authReducer from './store/reducers/auth'; // ADD
//...
const rootReducer = combineReducers({
  burgerBuilder: burgerBuilderReducer,
  order: orderReducer,
  auth: authReducer, // ADD
});
//...
```

### 9. Adding a Spinner

```js
// src/containers/Auth/Auth.js
//...
class Auth extends Component {
  //...
  render() {
    const formElementsArray = [];
    for (const key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    let form = formElementsArray.map(({ id, config }) => (
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
    ));

    // ADD
    if (this.props.loading) {
      form = <Spinner />;
    }

    // ADD
    let errorMessage = null;

    if (this.props.error) {
      errorMessage = <p>{this.props.error.message}</p>;
    }

    return (
      <div className={classes.Auth}>
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">SUBMIT</Button>
        </form>
        <Button clicked={this.switchAuthModeHandler} btnType="Danger">
          SWITCH TO {this.state.isSignUp ? 'SIGNIN' : 'SIGNUP'}
        </Button>
      </div>
    );
  }
}

// ADD
const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
  };
};

//...

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
```

### 10. Logging Users Out

```js
// src/store/actions/auth.js
//...
// ADD
export const logout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

// ADD (to automatically logout the user when the token expires)
export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const auth = (email, password, isSignUp) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      email,
      password,
      returnSecureToken: true,
    };
    const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_API_KEY}`;
    const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_API_KEY}`;
    const url = isSignUp ? signUpUrl : signInUrl;
    axios
      .post(url, authData)
      .then((response) => {
        const { idToken, localId, expiresIn } = response.data;
        dispatch(authSuccess(idToken, localId));
        dispatch(checkAuthTimeout(expiresIn)); // ADD
      })
      .catch((error) => {
        console.log('error: ', error);
        dispatch(authFail(error.response.data.error));
      });
  };
};
```

```js
// src/store/reducers/auth.js
//...
// ADD
const authLogout = (state, action) => {
  return updateObject(state, { token: null, userId: null });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    //...
    // ADD
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    default:
      return state;
  }
};
//...
```

### 11. Accessing Protected Resources

Let's turn our heads towards using that token to make requests to protected resources. That's of course a typical use case, we have a backend with certain API endpoints which should only be usable by authenticated users, right now in our demo backend with Firebase, that's not the case though.

Changing database rules in Firebase – all clear

```json
{
  "rules": {
    "ingredients": {
      ".read": true,
      ".write": true
    },
    "orders": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

```js
// src/store/actions/order.js
//...
export const fetchOrders = (token) => {
  // we could have used `(dispatch, getState)` and use `getState` to get access to the state => the token
  return (dispatch) => {
    dispatch(fetchOrdersStart());
    axios
      .get(`/orders.json?auth=${token}`) // we need to pass the token
      .then(({ data }) => {
        const fetchedOrders = [];
        for (const key in data) {
          fetchedOrders.push({ ...data[key], id: key });
        }
        dispatch(fetchOrdersSuccess(fetchedOrders));
      })
      .catch((error) => {
        dispatch(fetchOrdersFail(error.message));
      });
  };
};
//...
```

```js
//
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

export class Orders extends Component {
  componentDidMount() {
    this.props.onFetchOrders(this.props.token); // ADD
  }

  render() {
    //...
}

const mapStateToProps = (state) => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token, // ADD get it from the auth "store"
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchOrders: (token) => dispatch(actions.fetchOrders(token)), // ADD (token param)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withErrorHandler(Orders, axios));
```

We're also doing it for purchasing a burger.

### 12. Updating the UI Depending on Auth State

We want to change **Authenticate** nav item with **Logout** when we're logged in.

We could transform `src/components/Navigation/NavigationItems/NavigationItems.js` file into a class component and connect it to the store (or using React hook)... but this is not recommended. Why because we want to keep **containers** (smart) and **component** (dumb) separated.

A better idea would be to connect `src/hoc/Layout/Layout.js` (our Layout).

```js
// src/hoc/Layout/Layout.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
//...

export class Layout extends Component {
  //...
  render() {
    return (
      <Aux>
        <Toolbar
          isAuth={this.props.isAuthenticated} // ADD
          drawerToggleClicked={this.sideDrawerToggleHandler}
        />
        <SideDrawer
          isAuth={this.props.isAuthenticated} // ADD
          open={this.state.showSideDrawer}
          closed={this.sideDrawerClosedHandler}
        />
        <main className={classes.Content}>{this.props.children}</main>
      </Aux>
    );
  }
}

// ADD
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(Layout);
```

```js
// src/components/Navigation/Toolbar/Toolbar.js
import React from 'react';
import classes from './Toolbar.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';

const Toolbar = (props) => {
  return (
    <header className={classes.Toolbar}>
      <DrawerToggle clicked={props.drawerToggleClicked} />
      <div className={classes.Logo}>
        <Logo />
      </div>
      <nav className={classes.DesktopOnly}>
        <NavigationItems isAuthenticated={props.isAuth} />
      </nav>
    </header>
  );
};

export default Toolbar;
```

```js
// src/components/Navigation/NavigationItems/NavigationItems.js
import React from 'react';
import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const NavigationItems = (props) => {
  return (
    <ul className={classes.NavigationItems}>
      <NavigationItem link="/" exact>
        Burger&nbsp;Builder
      </NavigationItem>
      <NavigationItem link="/orders">Orders</NavigationItem>
      {!props.isAuthenticated ? (
        <NavigationItem link="/auth">Authenticate</NavigationItem>
      ) : (
        <NavigationItem link="/logout">Logout</NavigationItem>
      )}
    </ul>
  );
};

export default NavigationItems;
```

### 13. Adding a Logout Link

The idea is **redirect** and **dispatch the logout action** when we click on the logout nav item.

```js
// src/containers/Auth/Logout/Logout.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as actions from '../../../store/actions/index';

export class Logout extends Component {
  componentDidMount() {
    this.props.onLogout();
  }

  render() {
    return <Redirect to="/" />;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(actions.logout()),
  };
};

export default connect(null, mapDispatchToProps)(Logout);
```

```js
// src/App.js
//...
class App extends Component {
  render() {
    return (
      <Layout>
        <Switch>
          <Route path="/" exact component={BurgerBuilder} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/orders" component={Orders} />
          <Route path="/auth" component={Auth} />
          <Route path="/logout" component={Logout} />
        </Switch>
      </Layout>
    );
  }
}

export default App;
```

### 14. Forwarding Unauthenticated Users

Preventing user not logged in to see **orders** in the `NavigationItems`.

```js
// src/components/Navigation/NavigationItems/NavigationItems.js
//...
const NavigationItems = (props) => {
  return (
    <ul className={classes.NavigationItems}>
      <NavigationItem link="/" exact>
        Burger&nbsp;Builder
      </NavigationItem>
      {!props.isAuthenticated ? (
        <NavigationItem link="/auth">Authenticate</NavigationItem>
      ) : (
        <React.Fragment>
          <NavigationItem link="/orders">Orders</NavigationItem>
          <NavigationItem link="/logout">Logout</NavigationItem>
        </React.Fragment>
      )}
    </ul>
  );
};
//...
```

Ensure to redirect the user as soon as he is logged in.

```js
// src/containers/Auth/Auth.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
//...

class Auth extends Component {
  //...

  render() {
    //...

    // ADD
    let authRedirect = null;

    // ADD
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to="/" />;
    }

    return (
      <div className={classes.Auth}>
        {authRedirect}
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">SUBMIT</Button>
        </form>
        <Button clicked={this.switchAuthModeHandler} btnType="Danger">
          SWITCH TO {this.state.isSignUp ? 'SIGNIN' : 'SIGNUP'}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    //...
    isAuthenticated: state.auth.token !== null, // ADD
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignUp) =>
      dispatch(actions.auth(email, password, isSignUp)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
```

---

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
//...

export class BurgerBuilder extends Component {
  //...

  purchaseHandler = () => {
    // ADD this logic
    if (this.props.isAuthenticated) {
      this.setState({ purchasing: true });
    } else {
      this.props.history.push('/auth');
    }
  };

  //...

  render() {
    //...
    let burger = (
      <Aux>
        <Burger ingredients={ings} />
        <BuildControls
          price={this.props.totalPrice}
          purchaseable={() => this.updatePurchaseState(this.props.ings)}
          ordered={this.purchaseHandler}
          isAuth={this.props.isAuthenticated} // ADD
          ingredientAdded={this.props.onIngredientAdded}
          ingredientRemoved={this.props.onIngredientRemoved}
          disabled={disabledInfo}
        />
      </Aux>
    );
    //...
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

const mapStateToProps = (state) => {
  return {
    //...
    isAuthenticated: state.auth.token !== null, // ADD
  };
};

//...

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withErrorHandler(BurgerBuilder, axios));
```

```js
// src/components/Burger/BuildControls/BuildControls.js
//...
const BuildControls = (props) => {
  return (
    //...
    <button
      className={classes.OrderButton}
      onClick={props.ordered}
      disabled={!props.purchaseable}
    >
      {props.isAuth ? 'ORDER NOW' : 'SIGN UP TO ORDER'}
    </button>
    //...
  );
};

export default BuildControls;
```

### 15. Redirecting the User to the Checkout Page

A lot to do and not new concepts...

### 16. Persistent Auth State with localStorage

If we are logged in and we reload the page, **the login state is lost**. The reason for this is that when we refresh the page, we download the single page application again, we download the JavaScript again, it gets executed again, it's a totally new application when we look at it like this.

Therefore our state stored in Redux (which is in the end just stored in JavaScript) is lost. So we need it to persist our login state across our sessions and this requires a browser API we can use, **local storage**.

```js
// src/store/actions/auth.js
//...

export const logout = () => {
  localStorage.removeItem('token'); // ADD
  localStorage.removeItem('userId'); // ADD
  localStorage.removeItem('expirationDate'); // ADD
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

//...

export const auth = (email, password, isSignUp) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      email,
      password,
      returnSecureToken: true,
    };
    const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_API_KEY}`;
    const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_API_KEY}`;
    const url = isSignUp ? signUpUrl : signInUrl;
    axios
      .post(url, authData)
      .then((response) => {
        const { idToken, localId, expiresIn } = response.data;
        // ADD
        const expirationDate = new Date(
          new Date().getTime() + response.data.expiresIn * 1000,
        );
        localStorage.setItem('token', response.data.idToken); // ADD
        localStorage.setItem('userId', response.data.localId); // ADD
        localStorage.setItem('expirationDate', expirationDate); // ADD
        dispatch(authSuccess(idToken, localId));
        dispatch(checkAuthTimeout(expiresIn));
      })
      .catch((error) => {
        console.log('error: ', error);
        dispatch(authFail(error.response.data.error));
      });
  };
};
//...
// this is a pure utility action creator which dispatches a couple of other actions depending on our current state.
export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate > new Date()) {
        const userId = localStorage.getItem('userId');
        dispatch(authSuccess(token, userId));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000,
          ),
        );
      } else {
        dispatch(logout());
      }
    }
  };
};
```

```js
// src/App.js
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    return (
      <Layout>
        <Switch>
          <Route path="/" exact component={BurgerBuilder} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/orders" component={Orders} />
          <Route path="/auth" component={Auth} />
          <Route path="/logout" component={Logout} />
        </Switch>
      </Layout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(null, mapDispatchToProps)(App);
```

### 17. Fixing Connect + Routing Errors

The error we're facing has to do with the fact that we're wrapping our `App` container with `connect` and that simply breaks our react router. We can easily fix that though we need to import the withRouter higher order component from react-router-dom and if you get an error like this which is always related to connect wrapping our component which we also want to load with routing and therefore this component doesn't receive our route props, we can simply wrap connect here with withRouter just like that.

And now, `withRouter` will enforce our props being passed down to our app component still and therefore the react router is back on the page and we'll know what's getting loaded so with that, we're working again.

```js
// src/App.js
import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    return (
      <Layout>
        <Switch>
          <Route path="/" exact component={BurgerBuilder} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/orders" component={Orders} />
          <Route path="/auth" component={Auth} />
          <Route path="/logout" component={Logout} />
        </Switch>
      </Layout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(App));
```

### 18. Ensuring App Security

Now let's talk about security a little bit, let's log in again. As we learned, we manage our auth state with the token, and we automatically log the user in if we have a valid token. Then, that token is only valid for 60 minutes though, that is for security reasons because if the token gets stolen, anyone can access our data, of course, now that sounds very bad.

Keep in mind though it's stored in our application in local storage, local storage can be accessed with cross-site scripting attacks, and React prevents cross-site scripting attacks. We can't output insecure code by default. So we got a lot of protection from that side, so our data and local storage should be safe, an additional safety net then is again that the token expires after one hour.

Having a token which never expires and which we can exchange for a token which gives we access to everything could lead to security issues or at least we should be very careful about protecting it if we are using the refresh token (via Firebase).

We can enhance the user experience by using the refresh token, we can essentially make sure the user is never logged out because as the refreshed token never expires, we can refresh the main token even after a week check for the token is valid, it isn't, take the refresh token and get a new one but due to that security thing, I opted not to use it. I wanted to bring this to our attention.

### 19. Guarding Routes

There are two more things we want to do: (1) we want to store the `userId` in any order we place so that on the backend in the orders, we also store the `userId` of the user who made that order. We can then also make sure we only fetch orders by that user. (2) We want to make sure that we can only visit the orders page and the checkout page even though we do redirect there if we are not building a burger but that we can visit both only if we are logged in.

```js
// src/App.js
import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/" exact component={BurgerBuilder} />
        <Route path="/auth" component={Auth} />
        <Redirect to="/" />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/" exact component={BurgerBuilder} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/orders" component={Orders} />
          <Route path="/logout" component={Logout} />
          <Redirect to="/" />
        </Switch>
      );
    }
    return <Layout>{routes}</Layout>;
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
```

### 20. Displaying User Specific Orders

```js
// In Firebase rule
{
  "rules": {
    "ingredients": {
      ".read": true,
    	".write": true,
    },
    "orders": {
      ".read": "auth != null",
      ".write": "auth != null",
        ".indexOn": ["userId"]
    }
  }
}
```

```js
// src/store/actions/order.js
//...
export const fetchOrders = (token, userId) => {
  return (dispatch) => {
    dispatch(fetchOrdersStart());
    const queryParams = `?auth=${token}&orderBy="userId"&equalTo="${userId}"`;
    axios
      .get(`/orders.json${queryParams}`)
      .then(({ data }) => {
        const fetchedOrders = [];
        for (const key in data) {
          fetchedOrders.push({ ...data[key], id: key });
        }
        dispatch(fetchOrdersSuccess(fetchedOrders));
      })
      .catch((error) => {
        dispatch(fetchOrdersFail(error.message));
      });
  };
};
//...
```

```js
// src/containers/Orders/Orders.js
//...
export class Orders extends Component {
  componentDidMount() {
    this.props.onFetchOrders(this.props.token, this.props.userId); // ADD the userId
  }

  render() {
    //...
  }
}

const mapStateToProps = (state) => {
  return {
    //...
    token: state.auth.token,
    userId: state.auth.userId, // ADD
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchOrders: (token, userId) =>
      dispatch(actions.fetchOrders(token, userId)), // ADD userId
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withErrorHandler(Orders, axios));
```
