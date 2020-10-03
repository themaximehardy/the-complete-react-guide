# A Real App: The Burger Builder (Basic Version)

### 1. Introduction

We're going to build a **burger application** so an real application where we can dynamically build a burger, add ingredients and then in the end of course also purchase it. We'll start with the **planning phase**. But how do we plan a React application?

### 2. Planning an App in React - Core Steps

How do we plan a React application?

Here are three very important steps (but we can split these up into more granular steps).

1. **Component Tree / Component Structure**
2. **Application State** (Data)
3. **Components** vs **Containers**

(1) It's super important to have an idea about what should go into its own component and what not.
(2) We can also translate this with the data we plan on using and manipulating in our application. For example, in our burger application, we need to keep track about the ingredients a user added because that will determine what we need to render and also what the user needs to pay in the end.
(3) Which components in our application should be **stateless** (= dumb components) so basically components that are functional and don't use hooks or even class-based components that don't use state. And which components have to be **stateful** components, so either functional components using their useState hook or class-based components using the state property.

### 3. Planning our App - Layout and Component Tree

Application layout:

![app-drawing](../img/s08/8-1-app-drawing.png 'app-drawing')

Component tree:

![app-components](../img/s08/8-2-app-components.png 'app-components')

### 4. Planning the State

What should be a **stateless component** and what should be a **stateful component**.

![app-state](../img/s08/8-3-app-state.png 'app-state')

We should manage the state in the `BurgerBuilder` component (and not the `App` component). The state we just listed is really just related to building a burger. So the burger builder should be a stateful component and the other pages should be stateless.

### 5. Enabling CSS Modules

We're going to use a styling solution named "**CSS modules**". In more recent project versions created by CRA, support for CSS modules is already built-in and we can use that feature without ejecting, [here is more information](https://facebook.github.io/create-react-app/docs/adding-a-css-modules-stylesheet).

### 6. Setting up the Project

```sh
yarn install
npm run eject
```

```js
// config/webpack.config.dev.js
//...
{
  test: /\.css$/,
  use: [
    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 1,
        modules: true, // ADD
        localIdentName: '[name]__[local]__[hash:base64:5]', // ADD
      },
    },
  //...
//...
```

```js
// config/webpack.config.prod.js
//...
{
  test: /\.css$/,
  loader: ExtractTextPlugin.extract(
    Object.assign(
      {
        fallback: {
          loader: require.resolve('style-loader'),
          options: {
            hmr: false,
          },
        },
        use: [
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              minimize: true,
              sourceMap: shouldUseSourceMap,
              modules: true, // ADD
              localIdentName: '[name]__[local]__[hash:base64:5]', // ADD
            },
          },
        //...
      //...
    //...
  //...
//...
```

### 7. Creating a Layout Component

Let's create 2 sub-folders: `/components` and `/containers`. **containers** are **stateful components** (= components created with the class keyword or functional components using `useState` and components going into the **components** folder are **dumb** or **presentational** components that don't manage state.

```js
// src/hoc/Aux.js
const aux = (props) => props.children;

export default aux;
```

```js
// src/components/Layout/Layout.js
import React from 'react';
import Aux from '../../hoc/Aux';

const Layout = (props) => {
  return (
    <Aux>
      <div>Toolbar, SideDrawer, Backdrop</div>
      <main>{props.children}</main>
    </Aux>
  );
};

export default Layout;
```

```js
// src/App.js
import React, { Component } from 'react';
import Layout from './components/Layout/Layout';

class App extends Component {
  render() {
    return (
      <Layout>
        <p>Test</p>
      </Layout>
    );
  }
}

export default App;
```

### 8. Starting Implementation of The Burger Builder Container

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
import React, { Component } from 'react';
import Aux from '../../hoc/Aux';

export class BurgerBuilder extends Component {
  render() {
    return (
      <Aux>
        <div>Burger</div>
        <div>Build Controls</div>
      </Aux>
    );
  }
}

export default BurgerBuilder;
```

```css
/* src/components/Layout/Layout.css */
.Content {
  margin-top: 16px;
}
```

```js
// src/components/Layout/Layout.js
import React from 'react';
import Aux from '../../hoc/Aux';
import classes from './Layout.css';

const Layout = (props) => {
  return (
    <Aux>
      <div>Toolbar, SideDrawer, Backdrop</div>
      <main className={classes.Content}>{props.children}</main>
    </Aux>
  );
};

export default Layout;
```

### 9. Adding a Dynamic Ingredient Component

It can be hard to manage all the components. A good way of structuring our project, in React to create granular components and not big chunks (it is a good practice). Now if we have a lot of components, we have a lot of files and to keep these files manageable, we want to create a folder structure which is not only divided in components and containers but where inside the components and containers, **we also divide it up by feature area** so that we quickly know if we need to work on the burger side, we have to go into the burger folder.

```js
// src/components/Burger/BurgerIngredient/BurgerIngredient.js
import React from 'react';
import classes from './BurgerIngredient.css';

const BurgerIngredient = (props) => {
  let ingredient = null;

  switch (props.type) {
    case 'bread-bottom':
      ingredient = <div className={classes.BreadBottom}></div>;
      break;
    case 'bread-top':
      ingredient = (
        <div className={classes.BreadTop}>
          <div className={classes.Seeds1}></div>
          <div className={classes.Seeds2}></div>
        </div>
      );
      break;
    case 'meat':
      ingredient = <div className={classes.Meat}></div>;
      break;
    case 'cheese':
      ingredient = <div className={classes.Cheese}></div>;
      break;
    case 'salad':
      ingredient = <div className={classes.Salad}></div>;
      break;
    case 'bacon':
      ingredient = <div className={classes.Bacon}></div>;
      break;
    default:
      ingredient = null;
      break;
  }
  return ingredient;
};

export default BurgerIngredient;
```

_Note: we have added the css file `src/components/Burger/BurgerIngredient/BurgerIngredient.css`._

### 10. Adding Prop Type Validation

```js
// src/components/Burger/BurgerIngredient/BurgerIngredient.js
import React from 'react';
import PropTypes from 'prop-types';
import classes from './BurgerIngredient.css';

const BurgerIngredient = (props) => {
  //...
};

BurgerIngredient.propTypes = {
  type: PropTypes.string.isRequired,
};

export default BurgerIngredient;
```

### 11. Starting the Burger Component

```js
// src/components/Burger/Burger.js
import React from 'react';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import classes from './Burger.css';

const Burger = () => {
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      <BurgerIngredient type="cheese" />
      <BurgerIngredient type="meat" />
      <BurgerIngredient type="bread-bottom" />
    </div>
  );
};

export default Burger;
```

```css
/* src/components/Burger/Burger.css */
.Burger {
  width: 100%;
  margin: auto;
  height: 250px;
  overflow: scroll;
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
}

@media (min-width: 500px) and (min-height: 400px) {
  .Burger {
    width: 350px;
    height: 300px;
  }
}

@media (min-width: 500px) and (min-height: 401px) {
  .Burger {
    width: 450px;
    height: 400px;
  }
}

@media (min-width: 1000px) and (min-height: 700px) {
  .Burger {
    width: 700px;
    height: 600px;
  }
}
```

### 12. Outputting Burger Ingredients Dynamically

```js
//...
// state from the BurgerBuilder to the Burger component
state = {
  ingredients: {
    salad: 1,
    bacon: 1,
    cheese: 2,
    meat: 2,
  },
};
//...
```

```js
// src/components/Burger/Burger.js
import React from 'react';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import classes from './Burger.css';

const Burger = ({ ingredients }) => {
  const transformedIngredients = Object.keys(ingredients).map((igKey) => {
    return [...Array(ingredients[igKey])].map((_, idx) => {
      return <BurgerIngredient key={igKey + idx} type={igKey} />;
    });
  });
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom" />
    </div>
  );
};

export default Burger;
```

### 13. Calculating the Ingredient Sum Dynamically

```js
// src/components/Burger/Burger.js
import React from 'react';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import classes from './Burger.css';

const Burger = ({ ingredients }) => {
  let transformedIngredients = Object.keys(ingredients)
    .map((igKey) => {
      return [...Array(ingredients[igKey])].map((_, idx) => {
        return <BurgerIngredient key={igKey + idx} type={igKey} />;
      });
    })
    // before reduce we could have [[], [], [], []] if we pass 0 value to our ingredients
    .reduce((acc, cur) => {
      return acc.concat(cur);
    }, []);

  if (!transformedIngredients.length) {
    transformedIngredients = <p>Please start adding ingredients!</p>;
  }
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom" />
    </div>
  );
};

export default Burger;
```

### 14. Adding the Build Control Component

```js
// src/components/Burger/BuildControls/BuildControls.js
import React from 'react';
import classes from './BuildControls.css';

const BuildControls = (props) => {
  return <div className={classes.BuildControls}></div>;
};

export default BuildControls;
```

```js
// src/components/Burger/BuildControls/BuildControl/BuildControl.js
import React from 'react';
import classes from './BuildControl.css';

const BuildControl = (props) => {
  return (
    <div className={classes.BuildControl}>
      <div className={classes.Label}>{props.label}</div>
      <button className={classes.Less}>Less</button>
      <button className={classes.More}>More</button>
    </div>
  );
};

export default BuildControl;
```

### 15. Outputting Multiple Build Controls

```js
// src/components/Burger/BuildControls/BuildControls.js
import React from 'react';
import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
  { label: 'Salad', type: 'salad' },
  { label: 'Bacon', type: 'bacon' },
  { label: 'Cheese', type: 'cheese' },
  { label: 'Meat', type: 'meat' },
];

const BuildControls = (props) => {
  return (
    <div className={classes.BuildControls}>
      {controls.map((control) => (
        <BuildControl key={control.label} label={control.label} />
      ))}
    </div>
  );
};

export default BuildControls;
```

### 16. Connecting State to Build Controls

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

const INGREDIENT_PRICE = {
  salad: 0.5,
  bacon: 0.7,
  cheese: 0.4,
  meat: 1.3,
};

export class BurgerBuilder extends Component {
  state = {
    ingredients: {
      salad: 1,
      bacon: 1,
      cheese: 2,
      meat: 2,
    },
    totalPrice: 4, // base price $4
  };

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
  };

  removeIngredientHandler = (type) => {};

  render() {
    return (
      <Aux>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls ingredientAdded={this.addIngredientHandler} />
      </Aux>
    );
  }
}

export default BurgerBuilder;
```

```js
// src/components/Burger/BuildControls/BuildControls.js
import React from 'react';
import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
  { label: 'Salad', type: 'salad' },
  { label: 'Bacon', type: 'bacon' },
  { label: 'Cheese', type: 'cheese' },
  { label: 'Meat', type: 'meat' },
];

const BuildControls = (props) => {
  return (
    <div className={classes.BuildControls}>
      {controls.map((control) => (
        <BuildControl
          key={control.label}
          label={control.label}
          added={() => props.ingredientAdded(control.type)}
        />
      ))}
    </div>
  );
};

export default BuildControls;
```

```js
// src/components/Burger/BuildControls/BuildControl/BuildControl.js
import React from 'react';
import classes from './BuildControl.css';

const BuildControl = (props) => {
  return (
    <div className={classes.BuildControl}>
      <div className={classes.Label}>{props.label}</div>
      <button className={classes.Less}>Less</button>
      <button onClick={props.added} className={classes.More}>
        More
      </button>
    </div>
  );
};

export default BuildControl;
```

### 17. Removing Ingredients Safely

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
//...
  render() {
    // ADD
    const disabledInfo = {
      ...this.state.ingredients,
    };
    for (const key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    // for example `disabledInfo`: {salad: true, meat: false,...}
    return (
      <Aux>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disabledInfo} // ADD
        />
      </Aux>
    );
  }
//...
```

```js
// src/components/Burger/BuildControls/BuildControls.js
import React from 'react';
import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

//...

const BuildControls = (props) => {
  return (
    <div className={classes.BuildControls}>
      {controls.map((control) => (
        <BuildControl
          key={control.label}
          label={control.label}
          added={() => props.ingredientAdded(control.type)}
          removed={() => props.ingredientRemoved(control.type)}
          disabled={props.disabled[control.type]} // ADD
        />
      ))}
    </div>
  );
};

export default BuildControls;
```

```js
// src/components/Burger/BuildControls/BuildControl/BuildControl.js
import React from 'react';
import classes from './BuildControl.css';

const BuildControl = (props) => {
  return (
    <div className={classes.BuildControl}>
      <div className={classes.Label}>{props.label}</div>
      <button
        onClick={props.removed}
        className={classes.Less}
        disabled={props.disabled} // ADD
      >
        Less
      </button>
      <button onClick={props.added} className={classes.More}>
        More
      </button>
    </div>
  );
};

export default BuildControl;
```

### 18. Displaying and Updating the Burger Price

```js
// src/components/Burger/BuildControls/BuildControls.js
//...
const BuildControls = (props) => {
  return (
    <div className={classes.BuildControls}>
      <p>
        Current Price: <strong>{props.price.toFixed(2)}</strong>
      </p>
      {...}
    </div>
  );
};
//...
```

### 19. Adding the Order Button

We keep ALL the state in the `BurgerBuilder`! Let's add a `purchaseable` state which will disable (or not) the "ORDER NOW" button.

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

//...

export class BurgerBuilder extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0,
    },
    totalPrice: 4,
    purchaseable: false, // ADD
  };

  updatePurchaseState(ingredients) {
    // ADD, information from `addIngredientHandler` and `removeIngredientHandler`
    const sum = Object.keys(ingredients)
      .map((igKey) => ingredients[igKey])
      .reduce((acc, cur) => {
        return acc + cur;
      }, 0);

    this.setState({ purchaseable: sum > 0 });
  }

  addIngredientHandler = (type) => {
    //...
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCounted;
    //...
    this.setState({ ingredients: updatedIngredients, totalPrice: newPrice });
    this.updatePurchaseState(updatedIngredients); // ADD, we needed to pass updatedIngredients otherwise or state wasn't upadted and we had to add 2 ingredients to see the button enable
  };

  removeIngredientHandler = (type) => {
    //...
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCounted;
    //...
    this.setState({ ingredients: updatedIngredients, totalPrice: newPrice });
    this.updatePurchaseState(updatedIngredients); // ADD
  };

  render() {
    //...
    return (
      <Aux>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          price={this.state.totalPrice}
          purchaseable={this.state.purchaseable}
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disabledInfo} // ADD
        />
      </Aux>
    );
  }
}

export default BurgerBuilder;
```

We need to `disabled={!props.purchaseable}` on the "ORDER NOW" button.

```js
// src/components/Burger/BuildControls/BuildControls.js
import React from 'react';
import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

//...

const BuildControls = (props) => {
  return (
    <div className={classes.BuildControls}>
      {...}
      <button className={classes.OrderButton} disabled={!props.purchaseable}>
        ORDER NOW
      </button>
    </div>
  );
};

export default BuildControls;
```

### 20. Creating the Order Summary Modal

We want to make sure that once we click the button, we open a modal with the order summary. We need a modal, we need a backdrop and we need to show some order summary. The idea behind the modal is to have a wrapping element which provides the styling which then simply wraps itself about any content we want to show in that modal.

```js
// src/components/UI/Modal/Modal.js
import React from 'react';
import classes from './Modal.css';

const Modal = (props) => {
  return <div className={classes.Modal}>{props.children}</div>;
};

export default Modal;
```

```js
// src/components/Burger/OrderSummary/OrderSummary.js
import React from 'react';
import Aux from '../../../hoc/Aux';

const OrderSummary = ({ ingredients }) => {
  const ingredientSummary = Object.keys(ingredients).map((igKey, idx) => {
    return (
      <li key={igKey + idx}>
        <span style={{ textTransform: 'capitalize' }}>{igKey}</span>:{' '}
        {ingredients[igKey]}
      </li>
    );
  });
  return (
    <Aux>
      <h3>Your Order</h3>
      <p>Delicious burger with the following ingredients: </p>
      <ul>{ingredientSummary}</ul>
      <p>Continue to Checkout</p>
    </Aux>
  );
};

export default OrderSummary;
```

Now we can pass our `OrderSummary` to the Modal in the `BurgerBuilder`:

```js
//...
<Modal>
  <OrderSummary ingredients={this.state.ingredients} />
</Modal>
//...
```

### 21. Showing & Hiding the Modal (with Animation)

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
//...
export class BurgerBuilder extends Component {
  state = {
    //...
    purchaseable: false,
    purchasing: false, // ADD
  };

  //...

  purchaseHandler = () => {
    this.setState({ purchasing: !this.state.purchasing }); // ADD
  };

  render() {
    //...
    return (
      <Aux>
        <Modal show={this.state.purchasing}>
          <OrderSummary ingredients={this.state.ingredients} />
        </Modal>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          price={this.state.totalPrice}
          purchaseable={this.state.purchaseable}
          ordered={this.purchaseHandler} // ADD
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disabledInfo}
        />
      </Aux>
    );
  }
}

export default BurgerBuilder;
```

Let's make some changes with our modal to create a CSS animation.

```js
// src/components/UI/Modal/Modal.js
import React from 'react';
import classes from './Modal.css';

const Modal = (props) => {
  return (
    <div
      style={{
        transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
        opacity: props.show ? 1 : 0,
      }}
      className={classes.Modal}
    >
      {props.children}
    </div>
  );
};

export default Modal;
```

### 22. Implementing the Backdrop Component

```js
// src/components/UI/Backdrop/Backdrop.js
import React from 'react';
import classes from './Backdrop.css';

const Backdrop = (props) => {
  return props.show ? (
    <div className={classes.Backdrop} onClick={props.clicked}></div>
  ) : null;
};

export default Backdrop;
```

```js
// src/components/UI/Modal/Modal.js
import React from 'react';
import classes from './Modal.css';
import Aux from '../../../hoc/Aux';
import Backdrop from '../Backdrop/Backdrop';

const Modal = (props) => {
  return (
    <Aux>
      <Backdrop show={props.show} clicked={props.modalClosed} />
      <div
        style={{
          transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
          opacity: props.show ? 1 : 0,
        }}
        className={classes.Modal}
      >
        {props.children}
      </div>
    </Aux>
  );
};

export default Modal;
```

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
//...
  return (
    <Aux>
      <Modal
        show={this.state.purchasing}
        modalClosed={this.purchaseCancelHandler}
      >
        <OrderSummary ingredients={this.state.ingredients} />
      </Modal>
      <Burger ingredients={this.state.ingredients} />
      {...}
    </Aux>
  );
//...
```

### 23. Adding a Custom Button Component

```js
// src/components/UI/Button/Button.js
import React from 'react';
import classes from './Button.css';

const Button = (props) => {
  return (
    <button
      className={[classes.Button, classes[props.btnType]].join(' ')}
      onClick={props.clicked}
    >
      {props.children}
    </button>
  );
};

export default Button;
```

```css
/* src/components/UI/Button/Button.css */
.Button {
  background-color: transparent;
  border: none;
  color: white;
  outline: none;
  cursor: pointer;
  font: inherit;
  padding: 10px;
  margin: 10px;
  font-weight: bold;
}

.Button:first-of-type {
  margin-left: 0;
  padding-left: 0;
}

.Success {
  color: #5c9210;
}

.Danger {
  color: #944317;
}
```

### 24. Implementing the Button Component

```js
// src/components/Burger/OrderSummary/OrderSummary.js
import React from 'react';
import Aux from '../../../hoc/Aux';
import Button from '../../UI/Button/Button';

const OrderSummary = (props) => {
  const { ingredients, purchaseCanceled, purchaseContinued } = props; // ADD
  const ingredientSummary = Object.keys(ingredients).map((igKey, idx) => {
    return (
      <li key={igKey + idx}>
        <span style={{ textTransform: 'capitalize' }}>{igKey}</span>:{' '}
        {ingredients[igKey]}
      </li>
    );
  });

  return (
    <Aux>
      <h3>Your Order</h3>
      <p>Delicious burger with the following ingredients: </p>
      <ul>{ingredientSummary}</ul>
      <p>Continue to Checkout</p>
      <Button btnType="Danger" clicked={purchaseCanceled}>
        CANCEL
      </Button>
      <Button btnType="Success" clicked={purchaseContinued}>
        CONTINUE
      </Button>
    </Aux>
  );
};

export default OrderSummary;
```

### 25. Adding the Price to the Order Summary

We just added the price `prop` to the OrderSummary. Easy!

### 26. Adding a Toolbar

```js
// src/components/Navigation/Toolbar/Toolbar.js
import React from 'react';
import classes from './Toolbar.css';

const Toolbar = (props) => {
  return (
    <header className={classes.Toolbar}>
      <div>MENU</div>
      <div>LOGO</div>
      <nav>
        <ul>
          <li>XXX</li>
          <li>YYY</li>
        </ul>
      </nav>
    </header>
  );
};

export default Toolbar;
```

And let's add the `Toolbar` to the `Layout`.

```js
// src/components/Layout/Layout.js
import React from 'react';
import Aux from '../../hoc/Aux';
import classes from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';

const Layout = (props) => {
  return (
    <Aux>
      <Toolbar />
      <main className={classes.Content}>{props.children}</main>
    </Aux>
  );
};

export default Layout;
```

### 27. Using a Logo in our Application

```js
// src/components/Logo/Logo.js
import React from 'react';
import burgerLogo from '../../assets/images/burger-logo.png'; // image from /assets folder (Webpack will understand it)
import classes from './Logo.css';

const Logo = () => {
  return (
    <div className={classes.Logo}>
      <img src={burgerLogo} alt="MyBurger" />
    </div>
  );
};

export default Logo;
```

### 28. Adding Reusable Navigation Items

```js
// src/components/Navigation/NavigationItems/NavigationItems.js
import React from 'react';
import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const NavigationItems = () => {
  return (
    <ul className={classes.NavigationItems}>
      <NavigationItem link="/" active>
        Burger&nbsp;Builder
      </NavigationItem>
      <NavigationItem link="/checkout">Checkout</NavigationItem>
    </ul>
  );
};

export default NavigationItems;
```

```js
// src/components/Navigation/NavigationItems/NavigationItem/NavigationItem.js
import React from 'react';
import classes from './NavigationItem.css';

const NavigationItem = (props) => {
  return (
    <li className={classes.NavigationItem}>
      <a href={props.link} className={props.active ? classes.active : null}>
        {props.children}
      </a>
    </li>
  );
};

export default NavigationItem;
```

### 29. Creating a Responsive Sidedrawer

```js
// src/components/Navigation/SideDrawer/SideDrawer.js
import React from 'react';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.css';

const SideDrawer = () => {
  //...
  return (
    <div className={classes.SideDrawer}>
      <Logo />
      <nav>
        <NavigationItems />
      </nav>
    </div>
  );
};

export default SideDrawer;
```

We manage the **animation** as below:

```css
/* src/components/Navigation/SideDrawer/SideDrawer.css */
.SideDrawer {
  position: fixed;
  width: 280px;
  max-width: 70%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 200;
  background-color: white;
  padding: 32px 16px;
  box-sizing: border-box;
  transition: transform 0.3s ease-out;
}

@media (min-width: 500px) {
  .SideDrawer {
    display: none;
  }
}

.Open {
  transform: translateX(0);
}

.Close {
  transform: translateX(-100%);
}
```

We add the new `SideDrawer` in our `Layout` component.

```js
// src/components/Layout/Layout.js
import React from 'react';
import Aux from '../../hoc/Aux';
import classes from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

const Layout = (props) => {
  return (
    <Aux>
      <Toolbar />
      <SideDrawer />
      <main className={classes.Content}>{props.children}</main>
    </Aux>
  );
};

export default Layout;
```

### 30. Working on Responsive Adjustments

We could add a prop to Logo `height="11%"`.

```js
// src/components/Navigation/SideDrawer/SideDrawer.js
//...
const SideDrawer = () => {
  //...
  return (
    <div className={classes.SideDrawer}>
      <Logo height="11%" />
      <nav>
        <NavigationItems />
      </nav>
    </div>
  );
};

export default SideDrawer;
```

```js
// src/components/Logo/Logo.js
//...
const Logo = (props) => {
  return (
    <div className={classes.Logo} style={{ height: props.height }}>
      <img src={burgerLogo} alt="MyBurger" />
    </div>
  );
};

export default Logo;
```

Or another approach, we could wrap `Logo` into a `div` and add a `className={classes.Logo}`. We can define in our `SideDrawer.css`:

```css
.Logo {
  height: 11%;
}
```

```js
// src/components/Navigation/SideDrawer/SideDrawer.js
//...
const SideDrawer = () => {
  //...
  return (
    <div className={classes.SideDrawer}>
      <div className={classes.Logo}>
        <Logo />
      </div>
      <nav>
        <NavigationItems />
      </nav>
    </div>
  );
};

export default SideDrawer;
```

### 31. More about Responsive Adjustments

```css
/* src/components/Navigation/NavigationItems/NavigationItems.css */
.NavigationItems {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-flow: column;
  align-items: center;
  height: 100%;
}

@media (min-width: 500px) {
  .NavigationItems {
    flex-flow: row;
  }
}
```

```css
/* src/components/Navigation/Toolbar/Toolbar.css */
@media (max-width: 499px) {
  .DesktopOnly {
    display: none;
  }
}
```

### 32. Reusing the Backdrop

```js
// src/components/Layout/Layout.js
//...
export class Layout extends Component {
  state = {
    showSideDrawer: true,
  };

  sideDrawerClosedHandler = () => {
    this.setState({ showSideDrawer: false });
  };

  render() {
    return (
      <Aux>
        <Toolbar />
        <SideDrawer
          open={this.state.showSideDrawer}
          closed={this.sideDrawerClosedHandler}
        />
        <main className={classes.Content}>{this.props.children}</main>
      </Aux>
    );
  }
}

export default Layout;
```

```js
// src/components/Navigation/SideDrawer/SideDrawer.js
import React from 'react';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/Aux';
import classes from './SideDrawer.css';

const SideDrawer = (props) => {
  let attachedClasses = [classes.SideDrawer, classes.Close];
  if (props.open) {
    attachedClasses = [classes.SideDrawer, classes.Open];
  }
  return (
    <Aux>
      <Backdrop show={props.open} clicked={props.closed} />
      <div className={attachedClasses.join(' ')}>
        <div className={classes.Logo}>
          <Logo />
        </div>
        <nav>
          <NavigationItems />
        </nav>
      </div>
    </Aux>
  );
};

export default SideDrawer;
```

### 33. Adding a Sidedrawer Toggle Button

```js
// src/components/Layout/Layout.js
import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import classes from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

export class Layout extends Component {
  state = {
    showSideDrawer: true,
  };

  sideDrawerClosedHandler = () => {
    this.setState({ showSideDrawer: false });
  };

  sideDrawerToggleHandler = () => {
    this.setState((prevState) => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  };

  render() {
    return (
      <Aux>
        <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />
        <SideDrawer
          open={this.state.showSideDrawer}
          closed={this.sideDrawerClosedHandler}
        />
        <main className={classes.Content}>{this.props.children}</main>
      </Aux>
    );
  }
}

export default Layout;
```

### 34. Adding a Hamburger Icon

```js
// src/components/Navigation/SideDrawer/DrawerToggle/DrawerToggle.js
import React from 'react';
import classes from './DrawerToggle.css';

const DrawerToggle = (props) => {
  return (
    <div className={classes.DrawerToggle} onClick={props.clicked}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default DrawerToggle;
```

```css
/* src/components/Navigation/SideDrawer/DrawerToggle/DrawerToggle.css */
.DrawerToggle {
  width: 40px;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  box-sizing: border-box;
  cursor: pointer;
}

.DrawerToggle div {
  width: 90%;
  height: 3px;
  background-color: white;
}

@media (min-width: 500px) {
  .DrawerToggle {
    display: none;
  }
}
```

### 35. Improving the App - Introduction

Let's dive into **two important things**, **prop types** and **pure components** (link with `shouldComponentUpdate`). Let's also have a look at all these **lifecycle methods** we learned about. Do we use them in there? Why don't we use them at any point right now? Where would we use them?

### 36. Prop Type Validation

**We're not doing any validation** in any other component (except `BurgerIngredient`) and the reason is, we're not working on a project which is going to get used by other people, we're not working on a third-party library, and we're not even working in a developer team... a lot of the reasons why properties might be used incorrectly aren't relevant here.

### 37. Improving Performance

Because in the `BurgerBuilder` we have the `Modal` and the `OrderSummary` where we passed prop which can re-render them (without seeing them). We need to be sure to prevent it.

```js
// src/containers/BurgerBuilder/BurgerBuilder.js
//...
  render() {
   //...
    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          <OrderSummary
            price={this.state.totalPrice}
            ingredients={this.state.ingredients}
            purchaseCanceled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}
          />
        </Modal>
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
  }
//...
```

Let's change the `Modal` component and add a `shouldComponentUpdate` method to prevent the update if `show` don't change.

```js
// src/components/UI/Modal/Modal.js
import React, { Component } from 'react';
import classes from './Modal.css';
import Aux from '../../../hoc/Aux';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.show !== this.props.show;
  }

  render() {
    return (
      <Aux>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        <div
          style={{
            transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: this.props.show ? 1 : 0,
          }}
          className={classes.Modal}
        >
          {this.props.children}
        </div>
      </Aux>
    );
  }
}

export default Modal;
```

We definitely improved our application because we make sure that we don't unnecessarily update `OrderSummary`. `OrderSummary` is included in the `BurgerBuilder` but it is not updated because the wrapping element `Modal` has a shouldComponentUpdate method where we control this.

### 38. Using Component Lifecycle Methods

We're going to use them, especially when we'll use HTTP requests.
