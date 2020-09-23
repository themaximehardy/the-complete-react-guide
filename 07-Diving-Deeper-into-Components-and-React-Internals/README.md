# Diving Deeper into Components & React Internals

_Useful Resources & Links_

- [More on useEffect()](https://reactjs.org/docs/hooks-effect.html)
- [State & Lifecycle](https://reactjs.org/docs/state-and-lifecycle.html)
- [PropTypes](https://reactjs.org/docs/typechecking-with-proptypes.html)
- [Higher Order Components](https://reactjs.org/docs/higher-order-components.html)
- [Refs](https://reactjs.org/docs/refs-and-the-dom.html)

### 1. Introduction

Let's dive **deeper into components** and not only the technical side but also how we may **split our application** into components.

### 2. A Better Project Structure

What should go into its own component and what do we group together in a higher component, in the root component for example?

In `src` we should have:

- `/assets`
- `/components`
- `/containers`
- `index.js`

![folders-structure](../img/s07/7-1-folders-structure.png 'folders-structure')

### 3. Splitting an App Into Components

We improved the structure because now in the app container, we don't have to worry about the logic of creating that list (Persons). We outsourced this to the `Persons.js` file and it is the best practice to **create granular pieces** where each component has a clear focus.

```js
// src/components/Persons/Persons.js
import React from 'react';
import Person from './Person/Person';

export const persons = ({ persons, clicked, changed }) =>
  persons.map(({ id, name, age }, index) => {
    return (
      <Person
        key={id}
        click={() => clicked(index)}
        name={name}
        age={age}
        changed={(event) => changed(event, id)}
      />
    );
  });

export default persons;
```

```js
// src/components/Cockpit/Cockpit.js
import React from 'react';
import classes from './Cockpit.css';

const cockpit = (props) => {
  let btnClass = '';

  if (props.showPersons) {
    btnClass = classes.Red;
  }

  let assignedClasses = [];

  if (props.persons.length <= 2) {
    assignedClasses.push(classes.red);
  }

  if (props.persons.length <= 1) {
    assignedClasses.push(classes.bold);
  }

  return (
    <div className={classes.Cockpit}>
      <h1>Hi, I'm a React App!</h1>
      <p className={assignedClasses.join(' ')}>This is really working!</p>
      <button className={btnClass} onClick={props.clicked}>
        Switch Name
      </button>
    </div>
  );
};

export default cockpit;
```

```js
// src/App.js
import React, { Component } from 'react';
import Persons from '../components/Persons/Persons';
import Cockpit from '../components/Cockpit/Cockpit';
import classes from './App.css';

class App extends Component {
  state = {
    persons: [
      { id: '1', name: 'Max', age: 29 },
      { id: '2', name: 'Jerôme', age: 26 },
      { id: '3', name: 'Morgane', age: 27 },
    ],
    otherState: 'some other value',
    showPersons: false,
  };

  deletePersonHandler = (personIndex) => {
    const persons = [...this.state.persons];
    persons.splice(personIndex, 1);
    this.setState({ persons });
  };

  nameChangedHandler = (event, id) => {
    const personIndex = this.state.persons.findIndex((person) => {
      return person.id === id;
    });

    const person = {
      ...this.state.persons[personIndex],
    };

    person.name = event.target.value;

    const persons = [...this.state.persons];
    persons[personIndex] = person;
    this.setState({ persons });
  };

  togglePersonsHandler = () => {
    const doesShow = this.state.showPersons;
    this.setState({ showPersons: !doesShow });
  };

  render() {
    return (
      <div className={classes.App}>
        <Cockpit
          persons={this.state.persons}
          showPersons={this.state.showPersons}
          clicked={this.togglePersonsHandler}
        />

        {this.state.showPersons && (
          <Persons
            persons={this.state.persons}
            clicked={this.deletePersonHandler}
            changed={this.nameChangedHandler}
          />
        )}
      </div>
    );
  }
}

export default App;
```

We should have clear responsibilities of our components, have them narrowly focused, and create granular components. Using as many functional components as possible and have our containers as lean as possible when it comes to JSX and styling, some containers might not even have a style file because they only import other components which then do the styling. This is a very lean setup here which allows us to have a flexible and maintainable application.

### 4. Comparing Stateless and Stateful Components

We're referring to **stateful components** when we're managing state in them. Now a functional component that manages its own state with the `useState` would of course also be a stateful component, so stateful does not automatically mean class-based component (which was historically the case).

A **stateless component** is a functional component which does not manage state.

By making the split between them, we keep our app manageable because we have a predictable flow of data, we know where our state changes. We can throw stateless component anywhere into our application and they work if we pass the right inputs in and as our application grows, we therefore have an easier time maintaining it.

### 5. Class-based vs Functional Components

|             Class-Based              |             Functional              |
| :----------------------------------: | :---------------------------------: |
| `class XY extends Component { ... }` |    `const XY = props => { ... }`    |
|          ✅ Access to State          | ✅ Access to State (via useState()) |
|          ✅ Lifecycle Hooks          |         ❌ Lifecycle Hooks          |
|  Access State and Props via `this`   |      Access Props via `props`       |
| `this.state.XY` and `this.props.XY`  |             `props.XY`              |

Use **class-based components** if we need to manage State or access to lifecycle hooks/methods and we don't want to use React Hooks! Or use **functional components** in any other cases.

### 6. Class Component Lifecycle Overview

Only available in **class-based components**!

- `constructor()`
- `getDerivedStateFromProps()`
- `getSnapshotBeforeUpdate()`
- `componentDidCatch()`
- `componentWillUnmount()`
- `shouldComponentUpdate()`
- `componentDidUpdate()`
- `componentDidMount()`
- `render()`

**Component lifecycle – Creation**

|                                          |                                                                                                           |
| :--------------------------------------: | :-------------------------------------------------------------------------------------------------------- |
|             `constructor()`              | <ul><li>Call `super(props)`</li><li>**DO**: set up State</li><li>**DON'T**: cause side-effects</li></ul>  |
| `getDerivedStateFromProps(props, state)` | <ul><li>**DO**: sync State</li><li>**DON'T**: cause side-effects</li></ul>                                |
|                `render()`                | Prepare & structure our JSX code                                                                          |
|       **Render child components**        |                                                                                                           |
|          `componentDidMount()`           | <ul><li>**DO**: cause side-effects</li><li>**DON'T**: update State</li><li>(triggers re-render)</li></ul> |

We don't really want to do side-effect action (HTTP req, storing something in the localstorage,...) in the `constructor` because that can impact performance and cause unnecessary re-render cycles which of course are pretty bad and we want to avoid.

Don't call setState in `componentDidMount()`!

### 7. Component Creation Lifecycle in Action

```js
// src/App.js
import React, { Component } from 'react';
//...
import classes from './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    console.log('[App.js] constructor');
  }

  state = {
    persons: [
      { id: '1', name: 'Max', age: 29 },
      { id: '2', name: 'Jerôme', age: 26 },
      { id: '3', name: 'Morgane', age: 27 },
    ],
    otherState: 'some other value',
    showPersons: false,
  };

  static getDerivedStateFromProps(props, state) {
    console.log('[App.js] getDerivedStateFromProps: ', props);
    return state;
  }

  componentDidMount() {
    console.log('[App.js] componentDidMount');
  }

  //...

  render() {
    console.log('[App.js] render');
    return (
      <div className={classes.App}>
        {...}
      </div>
    );
  }
}

export default App;

```

### 8. Component Update Lifecycle (for `props` Changes)

Just as we have a lifecycle for the component creation, we also have one for updating components. When `props` or `state` change which are the two triggers we have for a component to be re-evaluated by React, then we go through a different lifecycle.

|                                                 |                                                                                                           |
| :---------------------------------------------: | :-------------------------------------------------------------------------------------------------------- |
|    `getDerivedStateFromProps(props, state)`     | <ul><li>**DO**: sync State to Props</li><li>**DON'T**: cause side-effects</li></ul>                       |
|  `shouldComponentUpdate(nextProps, nextState)`  | <ul><li>**DO**: decide whether to continue or not</li><li>**DON'T**: cause side-effects</li></ul>         |
|                   `render()`                    | Prepare & structure our JSX code                                                                          |
|        **Update child components props**        |                                                                                                           |
| `getSnapshotBeforeUpdate(prevProps, prevState)` | <ul><li>**DO**: last-minute DOM ops</li><li>**DON'T**: cause side-effects</li></ul>                       |
|             `componentDidUpdate()`              | <ul><li>**DO**: cause side-effects</li><li>**DON'T**: update State</li><li>(triggers re-render)</li></ul> |

With `shouldComponentUpdate(nextProps, nextState)` we can decide whether or not React should continue evaluating and re-rendering the component. Why? For performance optimization. This should be used carefully because obviously, we can break our components if we block an update from happening incorrectly but it is very powerful since it allows ua to also prevent unnecessary update cycles.

Note about `componentDidUpdate()`. If we make an HTTP request and we get back a response and then we update our component... and then this cycle starts again (=> infinite loop). What we shouldn't do is updating the `state` with `setState` outside of the block of a promise of an HTTP request. It's fine to do it as a result of some async task we're kicking off here but we should not call it synchronously in componentDidUpdate because that will simply lead to an unnecessary re-render cycle.

```js
// src/components/Persons/Persons.js
import React, { Component } from 'react';
import Person from './Person/Person';

class Persons extends Component {
  static getDerivedStateFromProps(props, state) {
    console.log('[Persons.js] getDerivedStateFromProps – props:', props);
    return state;
  }

  componentWillReceiveProps(props) {
    console.log('[Persons.js] componentWillReceiveProps – props: ', props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('[Persons.js] shouldComponentUpdate');
    return true;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('[Persons.js] getSnapshotBeforeUpdate');
    return { message: 'Snapshot!' };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('[Persons.js] componentDidUpdate');
    console.log('[Persons.js] componentDidUpdate – snapshot: ', snapshot);
  }

  render() {
    const { persons, clicked, changed } = this.props;
    console.log('[Persons.js] rendering...');
    return persons.map(({ id, name, age }, index) => {
      return (
        <Person
          key={id}
          click={() => clicked(index)}
          name={name}
          age={age}
          changed={(event) => changed(event, id)}
        />
      );
    });
  }
}
export default Persons;
```

### 9. Component Update Lifecycle (for `state` Changes)

```js
//...
componentDidMount() {
  console.log('[App.js] componentDidMount');
}

shouldComponentUpdate(nextProps, nextState) {
  console.log('[App.js] shouldComponentUpdate');
  return true;
}

componentDidUpdate() {
  console.log('[App.js] componentDidUpdate');
}
//...
```

### 10. Using useEffect() in Functional Components

`useEffect` basically **combines the functionality or the use cases we can cover of all these class-based lifecycle hooks in one React Hook**. `useEffect` as a default takes a function that will run for every render cycle.

```js
// src/components/Cockpit/Cockpit.js
import React, {useEffect} from 'react';
import classes from './Cockpit.css';

const cockpit = (props) => {
  useEffect(() => {
    console.log('[Cockpit.js] useEffect')
    // Http req...
  })

  //...

  return (
    <div className={classes.Cockpit}>
      {...}
    </div>
  );
};

export default cockpit;
```

`useEffect` is `componentDidMount` and `componentDidUpdate` combined in one effect.

### 11. Controlling the useEffect() Behavior

```js
//...
useEffect(() => {
  console.log('[Cockpit.js] useEffect');
  // Http req...
  setTimeout(() => {
    alert('🚨 saved data to cloud!');
  }, 1000);
}, [props.persons]);
//...
```

`useEffect` is only called when `persons` changes.

```js
//...
useEffect(() => {
  console.log('[Cockpit.js] useEffect');
  // Http req...
  setTimeout(() => {
    alert('🚨 saved data to cloud!');
  }, 1000);
}, []);
//...
```

`[]` passed as a second argument = execute this when the component renders the first time!

### 12. Cleaning up with Lifecycle Hooks & useEffect()

**class-based component**

```js
componentWillUnmount() {
  console.log('[Persons.js] componentWillUnmount');
}
```

**functional component**

```js
useEffect(() => {
  console.log('[Cockpit.js] useEffect');
  // Http req...
  setTimeout(() => {
    alert('🚨 saved data to cloud!');
  }, 1000);
  return () => {
    console.log('[Cockpit.js] cleanup work in useEffect'); // cleanup work here
  };
}, []);
```

### 13. Cleanup Work with useEffect() - Example

```js
useEffect(() => {
  console.log('[Cockpit.js] useEffect');
  // Http req...
  const timer = setTimeout(() => {
    alert('🚨 saved data to cloud!');
  }, 1000);
  return () => {
    clearTimeout(timer);
    console.log('[Cockpit.js] cleanup work in useEffect');
  };
}, []);
```

### 14. Using `shouldComponentUpdate` for optimization

Something is going wrong in our app. In `Persons.js` we have `shouldComponentUpdate` and we return `true` which means by default whenever something changes here on this component, whenever it gets re-rendered, then we update. Now `Persons.js` already gets re-rendered when something changes in `App.js`, something changes because `Persons.js` is in the end a child component of `App.js`.

So, whenever we change something in `App.js`, even if that only affects the `Cockpit.js` or anything else in `App.js` but not `Persons.js`, the `Persons.js` child still gets re-rendered because that render function here gets called and therefore this whole function executes and React will go through that entire component tree... that is how it works and that is how it makes sense logically because this is a function, it gets executed from top to bottom.

But we can prevent this by simply checking what changed in `shouldComponentUpdate` here in `Persons.js`.

```js
// src/components/Persons/Persons.js
shouldComponentUpdate(nextProps, nextState) {
  console.log('[Persons.js] shouldComponentUpdate');
  if (nextProps.persons !== this.props.persons) {
    return true;
  } else {
    return false;
  }
}
```

We should use `shouldComponentUpdate` to avoid unnecessary re-rendering! And can save us performance!

Note: here, in our case, `persons` is an array, and **arrays just like objects in Javascript are reference types**. In short, the idea here is that reference types, so arrays and objects, are stored in memory and what we actually store in variables and properties here are **only pointers** at that place in memory, so what **we do compare here is actually the pointer**. If something in that `Persons` component changed and the pointer is still the same then this update wouldn't run!

The only reason why it does run here is because in `App.js` when we do update `persons`, we create a copy of the `persons` we want to change and then we create a copy of that `persons` array => gets a new pointer and therefore, the pointers now also differ.

_Note: in Chrome Dev tools – Console – (3 vertical dots ...) – More tools – Rendering – (enable) **Paint flashing**._

### 15. Optimizing Functional Components with React.memo()

Before we have a look at the internal re-rendering process, let's have a look at how we can optimize performance with **functional components** because `shouldComponentUpdate` is a great tool but it's **only available in class-based components**.

Let's check our `Cockpit` component. What should trigger a re-rendering? The `persons` length, the `title` and `showPersons` value. But the names of the persons are totally irrelevant.

We can use `React.memo` and wrap our component into it `export default React.memo(Cockpit);`. This basically uses **memoization** which is a technique where React will memoize = **store a snapshot of this component and only if its input changes**, it will re-render it! If its inputs do not change and some parent components wants to update this `Cockpit` component then, **React will give back that stored component**.

### 16. When Should you Optimize?

We could implement `React.memo` and/or `shouldComponentUpdate` on every component... But it is not a good idea!

The check we make `shouldComponentUpdate` doesn't come for free. It's not a super performance heavy check but still, it is code that executes!

If we're pretty sure that in all or almost all cases where our parent updates, we will need to update too, then we should not add `shouldComponentUpdate` or `React.memo` because we will just execute some extra logic that makes no sense and actually just slows down the application a tiny bit.

### 17. PureComponents instead of shouldComponentUpdate

If we have a **class-based component** where we implement `shouldComponentUpdate`, and if we implement a check where we simply want to compare all `props` that matter to a component for difference, then **there is an easier way of writing that component**.

Then we could write `Persons.js` as `PureComponent`.

```js

import React, { PureComponent } from 'react';
import Person from './Person/Person';

class Persons extends PureComponent {
  // we need to remove `shouldComponentUpdate`, we don't need it anymore

  render() {
    {...}
  }
}
export default Persons;
```

Because `PureComponent` in the end is just a normal component that already implements `shouldComponentUpdate` with a complete props check, so that checks for any changes in any prop of that component.

### 18. How React Updates the DOM

How does React update the real DOM? The `render` method (class-based and functional components) being called does not immediately `render` the real DOM (the name `render` can be misleading).

The `render` is more a suggestion of what the HTML should look like in the end but `render` can very well be called and lead to the same result (as we saz when we use `shouldComponentUpdate` to prevent unnecessary render calls).

**React compares virtual DOMs**. It has an old virtual DOM and a re-rendered or a future virtual DOM. React takes this virtual DOM approach because it's faster than the real DOM. **A virtual DOM is simply a DOM represention in JavaScript**.

React basically keeps two copies of the DOM and makes a comparison between the old one and the new one and checks it there are any differences. If it can detect differences, it reaches out to the real DOM and updates it and even then, it doesn't re-render the real DOM entirely, it only changes it in the places where differences were detected. And if no differences were found, then it doesn't touch the real DOM.

**Accessing the DOM is really slow**, we want to do as little as possible and hence, React has this virtual DOM idea, compares the virtual DOM and make sure that the real DOM is only touched if needed.

### 19. Rendering Adjacent JSX Elements

**You must only have one root JSX element return when you render it**, it could be another component or a normal HTML element. But as we've seen we could also return an array! React does allow us to return an array of adjacent elements as long as we always provide a key and that key is required so that React can efficiently update and reorder these elements. We could create a `Aux` component as below and use it to only return one expression.

```js
// src/hoc/Aux.js
const aux = (props) => props.children;

export default aux;
```

### 20. Using React.Fragment

Since React 16.2, there is a built-in `Aux` component, built into React – `<React.Fragment></React.Fragment>`.

### 21. Higher Order Components (HOC) - Introduction

A higher-order component (HOC) is an advanced technique in React for reusing component logic. HOCs are not part of the React API, per se. They are a pattern that emerges from React’s compositional nature. Concretely, a higher-order component is a function that takes a component and returns a new component.

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

Let's create a new one, `WithClass` (a convention to use `with` in front).

```js
// src/hoc/WithClass.js
import React from 'react';

const withClass = (props) => {
  return <div className={props.classes}>{props.children}</div>;
};

export default withClass;
```

```js
// src/containers/App.js
import React, { Component } from 'react';
//...
import WithClass from '../hoc/WithClass'; // uppercase because it is a component
import classes from './App.css';

class App extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    //...
  };

  //...

  render() {
    return (
      <WithClass classes={classes.App}>
        {...}
      </WithClass>
    );
  }
}

export default App;
```

### 22. Another Form of HOCs

Another way to create an HOC:

```js
// src/hoc/WithClass.js
import React from 'react';

const withClass = (WrappedComponent, className) => {
  return (props) => (
    <div className={className}>
      <WrappedComponent />
    </div>
  );
};

export default withClass;
```

```js
// src/containers/App.js
import React, { Component } from 'react';
//...
import withClass from '../hoc/WithClass'; // lowercase because it is not a component anymore
import classes from './App.css';

class App extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    //...
  };

  //...

  render() {
    return (
      <Aux>
        {...}
      </Aux>
    );
  }
}

export default withClass(App, classes.App);
```

_Note: same as Redux (we're going to see it later)_

### 23. Passing Unknown Props

When we do the same with `Person` there is a problem. We're passing `props` which we don't pass through `wihtClass`. Let's fix it, by adding this `<WrappedComponent {...props} />`!

```js
// src/hoc/WithClass.js
import React from 'react';

const withClass = (WrappedComponent, className) => {
  return (props) => (
    <div className={className}>
      <WrappedComponent {...props} />
    </div>
  );
};

export default withClass;
```

The spread operator pulls out all the properties that are inside of this props object and distributes them as new key-value pairs on this wrapped component.

```js
// src/components/Persons/Person/Person.js
import React, { Component } from 'react';
import classes from './Person.css';
import Aux from '../../../hoc/Aux';
import withClass from '../../../hoc/WithClass';

class Person extends Component {
  //...
  render() {
    return (
      <Aux>
        <p onClick={this.props.click}>
          I'm a {this.props.name} and I'm {this.props.age} years old!
        </p>
        <p>{this.props.children}</p>
        <input
          type="text"
          onChange={this.props.changed}
          value={this.props.name}
        />
      </Aux>
    );
  }
}

export default withClass(Person, classes.Person);
```

### 24. Setting State Correctly

Currently we set our state correctly. But let's say we want in `App.js` adding a counter, to count the number of times there is a change in the input (adding a letter, or removing one). We could add this counter (from the state) in `nameChangedHandler` and increment its value inside of the `setState`. NOT A GOOD IDEA!

```js
// bad idea
this.setState({
  persons: persons, // OK
  changeCounter: this.state.changeCounter + 1, // NOT OK
});
```

It is the wrong way of updating it. Behind the scenes, `setState` **does not immediately trigger an update** of the state of this component in a re-render cycle instead it's basically **scheduled by React** and React will then perform the state update and the re-render cycle when it has the available resources to do it. Typically, that will of course be instantly especially in simple applications like we have right now, **but it's not guaranteed**!

We call `setState` **synchronously** here but it's not guaranteed to execute and finish immediately and therefore, this state when used for a state update is not guaranteed to be the latest state or the previous state on which we depend, **it could be an older state**.

But there is a better way.

```js
// better approach
this.setState((prevState, props) => {
  return {
    persons: persons,
    changeCounter: prevState.changeCounter + 1,
  };
});
```

We are now not referring to `this` state but we can refer to the previous state changeCounter. And React guarantees us that this will be the actual previous state as we would expect it for this `setState` update.

### 25. Using PropTypes

We can improve the way we pass our props to a component to be more clear about which props our component uses and to also give us a warning if we try to pass in incorrect props.

Install `prop-types` as below.

```sh
yarn add -D prop-types
```

```js
// src/components/Persons/Person/Person.js
import React, { Component } from 'react';
import classes from './Person.css';
import Aux from '../../../hoc/Aux';
import withClass from '../../../hoc/WithClass';
import PropTypes from 'prop-types';

class Person extends Component {
  //...
  render() {
    return (
      <Aux>
        <p onClick={this.props.click}>
          I'm a {this.props.name} and I'm {this.props.age} years old!
        </p>
        <p>{this.props.children}</p>
        <input
          type="text"
          onChange={this.props.changed}
          value={this.props.name}
        />
      </Aux>
    );
  }
}

Person.propTypes = {
  click: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  changed: PropTypes.func.isRequired,
};

export default withClass(Person, classes.Person);
```

### 26. Using Refs

What do we do if we want to get access to a specific JSX element (with any JSX element)? For example, how can we render all the `Person` and focus on the last input.

On any element we can add a special `ref` keyword. `ref` is like a key, a special property we can pass into any component. It is detected and understood by React.

`this.inputElement` is now a global property, available everywhere in our component. Accessible by `componentDidMount()` which use it to add a focus.

```js
// src/components/Persons/Person/Person.js
import React, { Component } from 'react';
import classes from './Person.css';
import Aux from '../../../hoc/Aux';
import withClass from '../../../hoc/WithClass';

class Person extends Component {
  //...
  componentDidMount() {
    this.inputElement.focus();
  }

  render() {
    return (
      <Aux>
        <p onClick={this.props.click}>
          I'm a {this.props.name} and I'm {this.props.age} years old!
        </p>
        <p>{this.props.children}</p>
        <input
          ref={(inputEl) => {
            this.inputElement = inputEl; // this.inputElement is now a global property
          }}
          type="text"
          onChange={this.props.changed}
          value={this.props.name}
        />
      </Aux>
    );
  }
}

export default withClass(Person, classes.Person);
```

But since React 16.3, we have another way of setting up a reference and that includes the constructor.

```js
import React, { Component } from 'react';
import classes from './Person.css';
import Aux from '../../../hoc/Aux';
import withClass from '../../../hoc/WithClass';
import PropTypes from 'prop-types';

class Person extends Component {
  constructor(props) {
    super(props)
    this.inputElementRef = React.createRef();
  }
  //...
  componentDidMount() {
    this.inputElementRef.current.focus();
  }

  render() {
    console.log('[Person.js] rendering...');
    return (
      <Aux>
        {...}
        <input
          ref={this.inputElementRef} // the other way to set up a ref
          type="text"
          onChange={this.props.changed}
          value={this.props.name}
        />
      </Aux>
    );
  }
}

Person.propTypes = {
  click: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  changed: PropTypes.func.isRequired,
};

export default withClass(Person, classes.Person);

```

### 27. Refs with React Hooks

```js
import React, { useEffect, useRef } from 'react';
import classes from './Cockpit.css';

const cockpit = (props) => {
  const toggleBtnRef = useRef(); // we need to use a React Hook

  useEffect(() => {
    toggleBtnRef.current.click(); // we need to set up after it render the first time to initialise the ref
  }, []);
  //...
  return (
    <div className={classes.Cockpit}>
      <h1>{props.title}</h1>
      <p className={assignedClasses.join(' ')}>This is really working!</p>
      <button ref={toggleBtnRef} className={btnClass} onClick={props.clicked}>
        Toggle Person
      </button>
    </div>
  );
};

export default React.memo(cockpit);
```

### 28. Understanding Prop Chain Problems

It is easy to pass `props` from component to component. The issue, it leads to extra redundancy and it makes our components a bit less reusable because wherever we're using the forwarder component... But since React 16.8 we have `Context` which help us solve this problem.

When you need to pass certain data/state in multiple components and **we don't want to pass that data/state across multiple layers of components** just to get it from component A (at the top) to component D (at the very bottom) when the components B, C in between don't really care about it and that's exactly the use case here.

### 29. Using the Context API

`React.createContext()` allows us to **initialize our context** with a **default value** because what the context is in the end, it is a **globally available JavaScript (object, array, string, number,...)** (where we decide where it is available).

```js
// src/context/auth-context.js
import React from 'react';

const authContext = React.createContext({
  authenticated: false,
  login: () => {},
});

export default authContext;
```

Then, we are going to import our new created context and then wrap everything (via `<AuthContext.Provider>{...}</AuthContext.Provider>`) where we want to be able to access this context later on.

```js
// src/containers/App.js
import React, { Component } from 'react';
import Persons from '../components/Persons/Persons';
import Cockpit from '../components/Cockpit/Cockpit';
//...
import AuthContext from '../context/auth-context'; // import

class App extends Component {
  state = {
    //...
  };
  //...
  render() {
    return (
      <Aux>
        <AuthContext.Provider
          value={{
            authenticated: this.state.authenticated,
            login: this.loginHandler,
          }}
        >
          <Cockpit
            title={this.props.appTitle}
            personsLength={this.state.persons.length}
            showPersons={this.state.showPersons}
            clicked={this.togglePersonsHandler}
          />

          {this.state.showPersons && (
            <Persons
              persons={this.state.persons}
              clicked={this.deletePersonHandler}
              changed={this.nameChangedHandler}
            />
          )}
        </AuthContext.Provider>
      </Aux>
    );
  }
}

export default withClass(App, classes.App);
```

_Note: React will re-render when `state` or `props` change. So only changing something in a `context` object **would not cause a re-render cycle and therefore this is not enough**._

To **get access to the context** value we need to **consume** it (after importing it) – `<AuthContext.Consumer>{(context) => {...}}</AuthContext.Consumer>` (note, we can't wrap our consumer in between JSX, we **HAVE TO return a function**!).

```js
import React, { Component } from 'react';
//...
import AuthContext from '../../../context/auth-context';

class Person extends Component {
  //...
  render() {
    return (
      <Aux>
        <AuthContext.Consumer>
          {(context) =>
            context.authenticated ? <p>Authenticated</p> : <p>Please log in!</p>
          }
        </AuthContext.Consumer>
        <p onClick={this.props.click}>
          I'm a {this.props.name} and I'm {this.props.age} years old!
        </p>
        <p>{this.props.children}</p>
        <input
          ref={this.inputElementRef}
          type="text"
          onChange={this.props.changed}
          value={this.props.name}
        />
      </Aux>
    );
  }
}
//...
export default withClass(Person, classes.Person);
```

```js
import React, { useEffect, useRef } from 'react';
import classes from './Cockpit.css';
import AuthContext from '../../context/auth-context';

const cockpit = (props) => {
  //...
  return (
    <div className={classes.Cockpit}>
      <h1>{props.title}</h1>
      <p className={assignedClasses.join(' ')}>This is really working!</p>
      <button ref={toggleBtnRef} className={btnClass} onClick={props.clicked}>
        Toggle Person
      </button>
      <AuthContext.Consumer>
        {(context) => <button onClick={context.login}>Log in</button>}
      </AuthContext.Consumer>
    </div>
  );
};

export default React.memo(cockpit);
```

### 30. contextType & useContext()

In **class-based components** and only there, we can use an **alternative pattern** to using that `<AuthContext.Consumer>`. Because the code might be a bit verbose and can be tricky to wrap our head around when we see it for the first time. But also if we want to have access to our context outside of our JSX.

We can add a special **static property** named `contextType`.

```js
static contextType = AuthContext;

console.log(this.context.authenticated);
```

_Note: `static` means it can be accessed from outside without the need to instantiate an object based on this class first and React will access contextType for us._

This allows React to **automatically connect** this class-based component to our context behind the scenes and it gives us a new property in this component. This allows us to **get access to our context** even in places like `componentDidMount` **where we previously couldn't**.

**In functional component we are also cover with Hooks with `useContext`!**

```js
const authContext = useContext(AuthContext);

console.log(authContext.authenticated);
```

The **Context API** is all about **managing data across components without the need to pass data around with props**.
