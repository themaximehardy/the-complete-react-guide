# Improving our Burger Project

### 1. Introduction

Let's polish it. Let's fix some tiny glitches it has and see what we can improve about it.

### 2. Fixing the Redirect to the Frontpage

Add a few improvements...

### 3. Using updateObject in the Entire App

Let's create a `shared` folder `src/shared`.

```js
// src/shared/utilty.js
export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};
```

```js
// src/containers/Auth/Auth.js
//...
import { updateObject } from '../../shared/utilty';
//...
inputChangedHandler = (event, controlName) => {
  const updatedControls = updateObject(this.state.controls, {
    [controlName]: updateObject(this.state.controls[controlName], {
      value: event.target.value,
      valid: this.checkValidity(
        event.target.value,
        this.state.controls[controlName].validation,
      ),
      touched: true,
    }),
  });
  this.setState({ controls: updatedControls });
};
//...
```

```js
// src/containers/Checkout/ContactData/ContactData.js
//...
import { updateObject } from '../../../shared/utilty';
//...
inputChangedHandler = (event, inputIdentifier) => {
  const updatedFormElement = updateObject(
    this.state.orderForm[inputIdentifier],
    {
      value: event.target.value,
      valid: this.checkValidity(
        event.target.value,
        this.state.orderForm[inputIdentifier].validation,
      ),
      touched: true,
    },
  );

  const updatedOrderForm = updateObject(this.state.orderForm, {
    [inputIdentifier]: updatedFormElement,
  });

  let formIsValid = true;
  for (const inputIdentifier in updatedOrderForm) {
    formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
  }

  this.setState({ orderForm: updatedOrderForm, formIsValid });
};
//...
```

### 4. Sharing the Validation Method

It would make sense to outsource the `checkValidity`, the validation logic. It's the same method in the `Auth` container and the `ContactData` container.

### 5. Using Environment Variables

If this project gets deployed, **everyone will be able to look into our store** with the Redux dev tools. That's not strictly or necessarily a problem, in the end people can always look into our JavaScript code if they really want to, we can't encrypt it but we maybe want to make it a bit harder and not as obvious to access our state.

Interesting fact, when we eject the app, we have access to the behind the scene about the environment variables. Let's have a look at the `burger-builder/config/env.js` file.

```js
'use strict';

const fs = require('fs');
const path = require('path');
const paths = require('./paths');

// Make sure that including paths.js after env.js will read .env variables.
delete require.cache[require.resolve('./paths')];

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  throw new Error(
    'The NODE_ENV environment variable is required but was not specified.',
  );
}

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
var dotenvFiles = [
  `${paths.dotenv}.${NODE_ENV}.local`,
  `${paths.dotenv}.${NODE_ENV}`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `${paths.dotenv}.local`,
  paths.dotenv,
].filter(Boolean);

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
dotenvFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv').config({
      path: dotenvFile,
    });
  }
});

// We support resolving modules according to `NODE_PATH`.
// This lets you use absolute paths in imports inside large monorepos:
// https://github.com/facebookincubator/create-react-app/issues/253.
// It works similar to `NODE_PATH` in Node itself:
// https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders
// Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
// Otherwise, we risk importing Node.js core modules into an app instead of Webpack shims.
// https://github.com/facebookincubator/create-react-app/issues/1023#issuecomment-265344421
// We also resolve them to make sure all tools using them work consistently.
const appDirectory = fs.realpathSync(process.cwd());
process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter((folder) => folder && !path.isAbsolute(folder))
  .map((folder) => path.resolve(appDirectory, folder))
  .join(path.delimiter);

// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment(publicUrl) {
  const raw = Object.keys(process.env)
    .filter((key) => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: process.env.NODE_ENV || 'development',
        // Useful for resolving the correct path to static assets in `public`.
        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        // This should only be used as an escape hatch. Normally you would put
        // images into the `src` and `import` them in code to get their paths.
        PUBLIC_URL: publicUrl,
      },
    );
  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
}

module.exports = getClientEnvironment;
```

```js
// src/index.js
//...
const composeEnhancers =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null || compose;
//...
```

### 6. Removing console.log()s

Let's check all the imports we never use – and clean them. Remove unnecessary imports to prevent bloating oour final bundle size.

It is also a good idea to clean up the console log statements. It would not be that bad but they will be there in production too and they will give insights into our application and besides that, we don't really need to spam the console with output that doesn't matter to us anymore.

### 7. Adding Lazy Loading

Now it's time to optimize the way we load our routes, we can use **lazy loading** there.

Let's have a look at our `App.js` file, we have the **checkout** route and the **orders** route and both are not necessarily visited by us, we might never go to the checkout, we might never wisit the orders area. Now the **auth** part maybe also never gets visited, we can load them all asynchronously, lazily.

```js
// src/hoc/asyncComponent/asyncComponent.js
import React, { Component } from 'react';

const asyncComponent = (importComponent) => {
  return class extends Component {
    state = {
      component: null,
    };

    componentDidMount() {
      importComponent().then((cmp) => {
        this.setState({ component: cmp.default });
      });
    }

    render() {
      const C = this.state.component;
      return C ? <C {...this.props} /> : null;
    }
  };
};

export default asyncComponent;
```

```js
// src/App.js
import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from './hoc/asyncComponent/asyncComponent'; // import asyncComponent

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
// import Checkout from './containers/Checkout/Checkout';
// import Orders from './containers/Orders/Orders';
// import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

// create all the async version below and use them in the routes
const asyncCheckout = asyncComponent(() =>
  import('./containers/Checkout/Checkout'),
);
const asyncOrders = asyncComponent(() => import('./containers/Orders/Orders'));
const asyncAuth = asyncComponent(() => import('./containers/Auth/Auth'));

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/" exact component={BurgerBuilder} />
        <Route path="/auth" component={asyncAuth} />
        <Redirect to="/" />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/" exact component={BurgerBuilder} />
          <Route path="/auth" component={asyncAuth} />
          <Route path="/checkout" component={asyncCheckout} />
          <Route path="/orders" component={asyncOrders} />
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

And with that, we improved our application because we now only load the code we need to load and don't load any unnecessary code. That is a great improvement and one important step before we actually build our application for production though as I also mentioned in the routing module, lazy loading is not always better.

If the lazily loaded modules are very small, as they are in our app to be honest, we might not really gain anything from adding lazy loading.
