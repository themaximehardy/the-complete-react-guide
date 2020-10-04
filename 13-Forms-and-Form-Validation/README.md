# Forms and Form Validation

_Useful Resources & Links_

- [Validate.js](https://validatejs.org/) (you may import its functionality into your React projects)
- [Get more ideas about potential validation approaches](https://react.rocks/tag/Validation)

Alternatives to the manual approach taken in this course:

- [react-validation package](https://www.npmjs.com/package/react-validation)
- [formsy-react package](https://github.com/christianalfoni/formsy-react)

### 1. Introduction

We're going to have a look at **forms** and **form validation** and how we actually may handle our contact data form in the burger application with ease.

### 2. Analyzing the App

The first step is to **decide which kind of data do we need** (which data are we going to store in the state). Then it would be best if we find a way of **dynamically generating our form**.

We need to link our data with our submission (which is not the case right now). **Handling the form submission** but also the **form validity**. We would like to change the styling of our form based on the validity.

Let's start by putting inputs into their own component.

### 3. Create a Custom Dynamic Input Component

```js
// src/components/UI/Input/Input.js
import React from 'react';
import classes from './Input.css';

const Input = (props) => {
  let inputElement = null;

  switch (props.inputtype) {
    case 'input':
      inputElement = <input className={classes.InputElement} {...props} />;
      break;
    case 'textarea':
      inputElement = <textarea className={classes.InputElement} {...props} />;
      break;
    default:
      inputElement = <input className={classes.InputElement} {...props} />;
      break;
  }
  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {inputElement}
    </div>
  );
};

export default Input;
```

```js
// src/containers/Checkout/ContactData/ContactData.js
import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input'; // ADD

class ContactData extends Component {
  state = {
    //...
  };

  orderHandler = (event) => {
    //...
  };

  render() {
    let form = (
      <form>
        <Input
          inputtype="input"
          type="text"
          name="name"
          placeholder="Your Name"
        />
        <Input
          inputtype="input"
          type="text"
          name="email"
          placeholder="Your Email"
        />
        <Input
          inputtype="input"
          type="text"
          name="street"
          placeholder="Street"
        />
        <Input
          inputtype="input"
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

### 4. Setting Up a JS Config for the Form

Let's find a way to **create our form dynamically** and to clearly define how each element should look like. We first change our state and we add `orderForm` which contains all our form property / config.

```js
// src/containers/Checkout/ContactData/ContactData.js
import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your name',
        },
        value: '',
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street',
        },
        value: '',
      },
      zipcode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP Code',
        },
        value: '',
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country',
        },
        value: '',
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your email',
        },
        value: '',
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'fastest', displayName: 'Fastest' },
            { value: 'cheapest', displayName: 'Cheapest' },
          ],
        },
      },
    },
    loading: false,
  };

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice,
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
        <Input elementType="..." elementConfig="..." value="..." />

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

```js
// src/components/UI/Input/Input.js
import React from 'react';
import classes from './Input.css';

const Input = (props) => {
  let inputElement = null;

  switch (props.elementType) {
    case 'input':
      inputElement = (
        <input
          className={classes.InputElement}
          {...props.elementConfig}
          value={props.value}
        />
      );
      break;
    case 'textarea':
      inputElement = (
        <textarea
          className={classes.InputElement}
          {...props.elementConfig}
          value={props.value}
        />
      );
      break;
    default:
      inputElement = (
        <input
          className={classes.InputElement}
          {...props.elementConfig}
          value={props.value}
        />
      );
      break;
  }
  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {inputElement}
    </div>
  );
};

export default Input;
```

### 5. Dynamically Create Inputs based on JS Config

```js
// src/containers/Checkout/ContactData/ContactData.js
import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your name',
        },
        value: '',
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street',
        },
        value: '',
      },
      zipcode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP Code',
        },
        value: '',
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country',
        },
        value: '',
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your email',
        },
        value: '',
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'fastest', displayName: 'Fastest' },
            { value: 'cheapest', displayName: 'Cheapest' },
          ],
        },
      },
    },
    loading: false,
  };

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice,
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
    // ADD
    const formElementsArray = [];
    for (const key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key],
      });
    }

    let form = (
      <form>
        {formElementsArray.map(({ id, config }) => (
          <Input
            key={id}
            elementType={config.elementType}
            elementConfig={config.elementConfig}
            value={config.value}
          />
        ))}
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

### 6. Adding a Dropdown Component

How to **change the value of a specific form element without mutating** the actual state? Look at `inputChangedHandler`.

```js
// src/components/UI/Input/Input.js
//...
  case 'select':
    inputElement = (
      <select
        className={classes.InputElement}
        {...props.elementConfig}
        value={props.value}
      >
        {props.elementConfig.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.displayName}
          </option>
        ))}
      </select>
    );
    break;
//...
```

### 7. Handling User Input

```js
// src/containers/Checkout/ContactData/ContactData.js
import React, { Component } from 'react';
//...

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your name',
        },
        value: '',
      },
      //...
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'fastest', displayName: 'Fastest' },
            { value: 'cheapest', displayName: 'Cheapest' },
          ],
        },
      },
    },
    loading: false,
  };

  //...

  inputChangedHandler = (event, inputIdentifier) => {
    // get a copy of the first level
    const updatedOrderForm = {
      ...this.state.orderForm,
    };

    // get a copy of the second level (based on the inputIdentifier)
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier],
    };

    // Now we can safely change the value of the updatedFormElement because it is a clone
    updatedFormElement.value = event.target.value;
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    this.setState({ orderForm: updatedOrderForm });
  };

  render() {
    const formElementsArray = [];
    for (const key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key],
      });
    }

    let form = (
      <form>
        {formElementsArray.map(({ id, config }) => (
          <Input
            key={id}
            elementType={config.elementType}
            elementConfig={config.elementConfig}
            value={config.value}
            // ADD
            changed={(event) => this.inputChangedHandler(event, id)}
          />
        ))}
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

### 8. Handling Form Submission

```js
// src/containers/Checkout/ContactData/ContactData.js
import React, { Component } from 'react';
//...

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your name',
        },
        value: '',
      },
      //...
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'fastest', displayName: 'Fastest' },
            { value: 'cheapest', displayName: 'Cheapest' },
          ],
        },
      },
    },
    loading: false,
  };

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });

    // ADD
    const formData = {};
    for (const formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[
        formElementIdentifier
      ].value;
    }

    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice,
      orderData: formData, // ADD
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

  inputChangedHandler = (event, inputIdentifier) => {
    //...
  };

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
            changed={(event) => this.inputChangedHandler(event, id)}
          />
        ))}
        <Button btnType="Success">ORDER</Button>
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

### 9. Adding Custom Form Validation

We can always submit the form, **we don't get any validation errors** and we don't see if the form is valid or not.

```js
// src/containers/Checkout/ContactData/ContactData.js
import React, { Component } from 'react';
//...

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your name',
        },
        validation: {
          required: true, // ADD
          minLength: 3, // ADD
        },
        valid: false, // ADD
        value: '',
      },
      //...
      zipcode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP Code',
        },
        validation: {
          required: true, // ADD
          minLength: 5, // ADD
          maxLength: 5, // ADD
        },
        valid: false, // ADD
        value: '',
      },
      //...
    },
    loading: false,
  };

  //...

  // ADD
  checkValidity(value, rules) {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.trim().length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.trim().length <= rules.maxLength && isValid;
    }

    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    // get a copy of the first level
    const updatedOrderForm = {
      ...this.state.orderForm,
    };

    // get a copy of the second level (based on the inputIdentifier)
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier],
    };

    // Now we can safely change the value of the updatedFormElement because it is a clone
    updatedFormElement.value = event.target.value;
    // ADD validation here
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation,
    );
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    this.setState({ orderForm: updatedOrderForm });
  };

  render() {
    //...
  }
}

export default ContactData;
```

### 10. Adding Validation Feedback

```js
// src/components/UI/Input/Input.js
import React from 'react';
import classes from './Input.css';

const Input = (props) => {
  let inputElement = null;
  const inputClasses = [classes.InputElement];

  // ADD
  // props.shouldValidate is useful for select (for example) where we don't want to validate it
  if (props.invalid && props.shouldValidate) {
    inputClasses.push(classes.Invalid);
  }

  switch (props.elementType) {
    case 'input':
      inputElement = (
        <input
          className={inputClasses.join(' ')}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;
    case 'textarea':
      inputElement = (
        <textarea
          className={inputClasses.join(' ')}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;
    case 'select':
      inputElement = (
        <select
          className={inputClasses.join(' ')}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        >
          {props.elementConfig.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.displayName}
            </option>
          ))}
        </select>
      );
      break;
    default:
      inputElement = (
        <input
          className={inputClasses.join(' ')}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;
  }
  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {inputElement}
    </div>
  );
};

export default Input;
```

```js
// src/containers/Checkout/ContactData/ContactData.js
import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your name',
        },
        validation: {
          required: true,
          minLength: 3,
        },
        valid: false,
        value: '',
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street',
        },
        validation: {
          required: true,
        },
        valid: false,
        value: '',
      },
      zipcode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP Code',
        },
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5,
        },
        valid: false,
        value: '',
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country',
        },
        validation: {
          required: true,
        },
        valid: false,
        value: '',
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your email',
        },
        validation: {
          required: true,
        },
        valid: false,
        value: '',
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'fastest', displayName: 'Fastest' },
            { value: 'cheapest', displayName: 'Cheapest' },
          ],
        },
        validation: {},
        valid: false,
        value: 'fastest',
      },
    },
    loading: false,
  };

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });

    const formData = {};
    for (const formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[
        formElementIdentifier
      ].value;
    }

    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice,
      orderData: formData,
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

  checkValidity(value, rules) {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.trim().length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.trim().length <= rules.maxLength && isValid;
    }

    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    // get a copy of the first level
    const updatedOrderForm = {
      ...this.state.orderForm,
    };

    // get a copy of the second level (based on the inputIdentifier)
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier],
    };

    // Now we can safely change the value of the updatedFormElement because it is a clone
    updatedFormElement.value = event.target.value;
    // ADD
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation,
    );
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    this.setState({ orderForm: updatedOrderForm });
  };

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
            invalid={!config.valid} // ADD
            shouldValidate={config.validation} // ADD
            changed={(event) => this.inputChangedHandler(event, id)}
          />
        ))}
        <Button btnType="Success">ORDER</Button>
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

### 11. Improving Visual Feedback

For **not starting with an all red form**, we have to track whatever a user already touched an input or not.

```js
// src/containers/Checkout/ContactData/ContactData.js
import React, { Component } from 'react';
//...

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        //...
        valid: false,
        touched: false, // ADD
        value: '',
      },
      street: {
        //...
        valid: false,
        touched: false, // ADD
        value: '',
      },
      //...
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'fastest', displayName: 'Fastest' },
            { value: 'cheapest', displayName: 'Cheapest' },
          ],
        },
        validation: {},
        value: 'fastest',
      },
    },
    loading: false,
  };

  //...

  checkValidity(value, rules) {
    //...
  }

  inputChangedHandler = (event, inputIdentifier) => {
    // get a copy of the first level
    const updatedOrderForm = {
      ...this.state.orderForm,
    };

    // get a copy of the second level (based on the inputIdentifier)
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier],
    };

    // Now we can safely change the value of the updatedFormElement because it is a clone
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid =
      updatedFormElement.validation &&
      this.checkValidity(
        updatedFormElement.value,
        updatedFormElement.validation,
      );
    updatedFormElement.touched = true; // ADD
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    this.setState({ orderForm: updatedOrderForm });
  };

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
            touched={config.touched} // ADD
            changed={(event) => this.inputChangedHandler(event, id)}
          />
        ))}
        <Button btnType="Success">ORDER</Button>
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

### 12. Showing Error Messages

We're not showing any error messages in our form, but we can of course easily add some.

The form inputs (`<Input />` component) already receives the information whether it's invalid or not. We could of course easily add some conditionally rendered element inside of that component.

For example (inside `<Input />` component function):

```js
//...
let validationError = null;
if (props.invalid && props.touched) {
  validationError = <p>Please enter a valid value!</p>;
}

return (
  <div className={classes.Input}>
    <label className={classes.Label}>{props.label}</label>
    {inputElement}
    {validationError}
  </div>
);
//...
```

This could of course be finetuned. We could also pass the value type (e.g. "email address") as a prop:

`validationError = <p>Please enter a valid {props.valueType}</p>;`

We could also receive the complete error message as a prop:

`validationError = <p>{props.errorMessage}</p>;`

And of course, also don't forget to style the messages if we want to do that:

`validationError = <p className={classes.ValidationError}>{props.errorMessage}</p>;`

In our CSS file, we could have:

```css
.ValidationError {
  color: red;
  margin: 5px 0;
}
```

### 13. Handling Overall Form Validity

```js
import React from 'react';
import classes from './Button.css';

const Button = (props) => {
  return (
    <button
      className={[classes.Button, classes[props.btnType]].join(' ')}
      onClick={props.clicked}
      disabled={props.disabled} // ADD
    >
      {props.children}
    </button>
  );
};

export default Button;
```

```js
import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        //...
        valid: false,
        touched: false,
        value: '',
      },
      //...
      deliveryMethod: {
        //...
        valid: true,
        value: '',
      },
    },
    formIsValid: false, // ADD
    loading: false,
  };

  //...

  inputChangedHandler = (event, inputIdentifier) => {
    //...
    // ADD
    let formIsValid = true;
    for (const inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }

    this.setState({ orderForm: updatedOrderForm, formIsValid });
  };

  render() {
    //...
    let form = (
      <form onSubmit={this.orderHandler}>
        {...}
        <Button btnType="Success" disabled={!this.state.formIsValid}>
          ORDER
        </Button>
      </form>
    );
    //...
  }
}

export default ContactData;
```

### 14. Fixing a Bug
