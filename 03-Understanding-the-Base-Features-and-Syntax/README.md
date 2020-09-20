# Understanding the Base Features & Syntax

_Useful Resources & Links_

- [create-react-app](https://github.com/facebookincubator/create-react-app)
- [Introducing JSX](https://reactjs.org/docs/introducing-jsx.html)
- [Rendering Elements](https://reactjs.org/docs/rendering-elements.html)
- [Components & Props](https://reactjs.org/docs/components-and-props.html)
- [Listenable Events](https://reactjs.org/docs/events.html)

### 1. Introduction

We'll learn how to build our first React project locally on our machine.

### 2. The Build Workflow

Before we setup a local project, we need to use a **more elaborate workflow** (than just using Codepen or jsbin). It is recommended for both SPAs and MPAs.

**Why?**

- **Optimise** code: we want to ship code that is **as small as possible** and **as optimized as possible**, because that increases the performance of our app.
- Use **next-gen JavaScript features**: it makes our life as a developer much easier! The code is _leaner_,_ easier to read_, _faster_, _less error prone_ and many other reasons. **+ compatibility reasons**, we need a build workflow that actually compiles these features to support as many browsers possible.
- Be **more productive**, it includes next generation JavaScript features which often allow us to write **more condensed code** but it also includes things like CSS auto-prefixing (increase the browser support for CSS features). Or **linting**.

**How?**

- Use **dependency management tool**: `NPM` or `yarn`.
- Use a **bundler**: here we're going to use **Webpack**.
- Use **compiler** (next-gen JavaScript): **Babel** + presets.
- Use a **development server**.

_Note: Create React App is a tool which have everything above out of the box – perfect to start a new React project :)_

### 3. Using Create React App

```sh
# create a new create-react-app project
npx create-react-app react-complete-guide --scripts-version 1.1.5
```

### 4. Understanding the Folder Structure

```
/node_modules
/public
/src
.gitignore
package.json
README.md
yarn.lock
```

All clear in this section.

### 5. Understanding Component Basics

Here is our first component. React is **all about component**!

```js
import React, { Component } from 'react'; // React and Component from react library
import './App.css';

// class App extends Component
class App extends Component {
  // render method is the only one which is required
  render() {
    // just below it is now HTML but JSX
    return (
      <div className="App">
        <h1>Hi, I'm a React App!</h1>
      </div>
    );
  }
}

// we need to export this component
export default App;
```

### 6. Understanding JSX

Working without JSX, replace it with `React.createElement`.

```js
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    // return (
    //   <div className="App">
    //     <h1>Hi, I'm a React App!</h1>
    //   </div>
    // );
    const h1 = React.createElement('h1', null, "Hi, I'm a React App!");
    return React.createElement('div', { className: 'App' }, h1);
  }
}

export default App;
```

### 7. JSX Restrictions

For example, `class` can't be used in JSX, because JSX is JS and `class` is **a reserved word**. Also we can't return more than one root element (solution using Fragment `<></>`).

### 8. Creating a Functional Component

```js
// src/Person/Person.js
import React from 'react';

const person = () => {
  return <div>I'm a Person!</div>;
};

export default person;
```

```js
// src/App.js
import React, { Component } from 'react';
import Person from './Person/Person';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Hi, I'm a React App!</h1>
        <Person />
      </div>
    );
  }
}

export default App;
```

### 9. Components & JSX Cheat Sheet

Components are the **core building block of React apps**. Actually, React really is just a library for creating components in its core.

A typical React app therefore could be depicted as a **component tree** - having one root component ("App") and then an potentially infinite amount of nested child components.

Each component needs to return/ render some **JSX** code - it defines which HTML code React should render to the real DOM in the end.

**JSX is NOT HTML** but it looks a lot like it. Differences can be seen when looking closely though (for example `className` in JSX vs `class` in "normal HTML"). JSX is just **syntactic sugar** for JavaScript, allowing you to write HTMLish code instead of nested `React.createElement(...)` calls.

When creating components, you have the choice between **two different ways**:

1. **Functional components** (also referred to as "**presentational**", "**dumb**" or "**stateless**" components - more about this later in the course) => `const cmp = () => { return <div>some JSX</div> }` (using ES6 arrow functions as shown here is recommended but optional)

2. **class-based components** (also referred to as "**containers**", "**smart**" or "**stateful**" components) => `class Cmp extends Component { render () { return <div>some JSX</div> } }`

### 10. Working with Components & Re-Using Them

```js
// src/App.js
import React, { Component } from 'react';
import './App.css';
import Person from './Person/Person';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Hi, I'm a React App!</h1>
        <Person />
        <Person />
        <Person />
      </div>
    );
  }
}

export default App;
```

### 11. Outputting Dynamic Content

```js
// src/Person/Person.js
import React from 'react';

const person = () => {
  return (
    <p>I'm a Person and I'm {Math.floor(Math.random() * 30)} years old!</p>
  );
};

export default person;
```

We output random/dynamic content into our HTML.

```
I'm a Person and I'm 29 years old!

I'm a Person and I'm 2 years old!

I'm a Person and I'm 5 years old!
```

### 12. Working with Props

```js
// src/App.js
import React, { Component } from 'react';
import './App.css';
import Person from './Person/Person';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Hi, I'm a React App!</h1>
        <Person name="Max" age="29" />
        <Person name="Jerôme" age="26" />
        <Person name="Morgane" age="27" />
      </div>
    );
  }
}

export default App;
```

```js
// src/Person/Person.js
import React from 'react';

const person = (props) => {
  return (
    <p>
      I'm a {props.name} and I'm {props.age} years old!
    </p>
  );
};

export default person;
```

_Note: class based component, use `this.props`._

### 13. Understanding the "children" Prop

```js
// src/App.js
//...
<Person name="Jerôme" age="26">
  My hobbies: Racing
</Person>
//...
```

We can access it via `props.children`.

```js
// src/Person/Person.js
import React from 'react';

const person = (props) => {
  return (
    <div>
      <p>
        I'm a {props.name} and I'm {props.age} years old!
      </p>
      <p>{props.children}</p>
    </div>
  );
};

export default person;
```

### 14. Understanding & Using State

_Note: changing the state, re-render the component._

```js
// src/App.js
import React, { Component } from 'react';
import './App.css';
import Person from './Person/Person';

class App extends Component {
  state = {
    persons: [
      { name: 'Max', age: 29 },
      { name: 'Jerôme', age: 26 },
      { name: 'Morgane', age: 27 },
    ],
  };

  render() {
    return (
      <div className="App">
        <h1>Hi, I'm a React App!</h1>
        <button>Switch Name</button>
        <Person
          name={this.state.persons[0].name}
          age={this.state.persons[0].age}
        />
        <Person
          name={this.state.persons[1].name}
          age={this.state.persons[1].age}
        >
          My hobbies: Racing
        </Person>
        <Person
          name={this.state.persons[2].name}
          age={this.state.persons[2].age}
        />
      </div>
    );
  }
}

export default App;
```

### 15. Prop & State

`props` and `state` are **CORE concepts** of React. Actually, only changes in `props` and/ or `state` **trigger React to re-render your components** and **potentially update the DOM** in the browser (a detailed look at how React checks whether to really touch the real DOM is provided in section 6).

**Props**

`props` allow you to pass data from a parent (wrapping) component to a child (embedded) component.

**State**

Whilst `props` allow you to pass data down the component tree (and hence trigger an UI update), `state` is used to change the component, well, state from within. Changes to state also trigger an UI update.

### 16. Handling Events with Methods

Let's add `onClick` on our button and link with a method `switchNameHandler`.

```js
// src/App.js
import React, { Component } from 'react';
import './App.css';
import Person from './Person/Person';

class App extends Component {
  state = {
    persons: [
      { name: 'Max', age: 29 },
      { name: 'Jerôme', age: 26 },
      { name: 'Morgane', age: 27 },
    ],
  };

  switchNameHandler = () => {
    console.log('was clicked!');
  };

  render() {
    return (
      <div className="App">
        <h1>Hi, I'm a React App!</h1>
        <button onClick={this.switchNameHandler}>Switch Name</button>
        <Person
          name={this.state.persons[0].name}
          age={this.state.persons[0].age}
        />
        <Person />
      </div>
    );
  }
}

export default App;
```

### 17. To Which Events Can You Listen?

A list of [supported events](https://reactjs.org/docs/events.html#supported-events).

#### Clipboard Events

| Event names | `onCopy` `onCut` `onPaste`        |
| ----------- | --------------------------------- |
| Properties  | - `DOMDataTransfer clipboardData` |

#### Composition Events

| Event names | `onCompositionEnd` `onCompositionStart` `onCompositionUpdate` |
| ----------- | ------------------------------------------------------------- |
| Properties  | - `string data`                                               |

#### Keyboard Events

| Event names | `onKeyDown` `onKeyPress` `onKeyUp` |
| ----------- | ---------------------------------- |
| Properties  | - `boolean altKey`                 |
|             | - `number charCode`                |
|             | - `boolean ctrlKey`                |
|             | - `boolean getModifierState(key)`  |
|             | - `string key`                     |
|             | - `number keyCode`                 |
|             | - `string locale`                  |
|             | - `number location`                |
|             | - `boolean metaKey`                |
|             | - `boolean repeat`                 |
|             | - `boolean shiftKey`               |
|             | - `number which`                   |

#### Focus Events

_Note: these **focus events work on all elements** in the React DOM, not just form elements._

| Event names | `onFocus` `onBlur`               |
| ----------- | -------------------------------- |
| Properties  | - `DOMEventTarget relatedTarget` |

#### Form Events

_Note: for more information about the onChange event, see [Forms](https://reactjs.org/docs/forms.html)._

| Event names | `onChange` `onInput` `onInvalid` `onSubmit` |
| ----------- | :-----------------------------------------: |
| Properties  |                      –                      |

#### Mouse Events

_Note: The `onMouseEnter` and `onMouseLeave` events propagate from the element being left to the one being entered instead of ordinary bubbling and do not have a capture phase._

`onClick` `onContextMenu` `onDoubleClick` `onDrag` `onDragEnd` `onDragEnter` `onDragExit`
`onDragLeave` `onDragOver` `onDragStart` `onDrop` `onMouseDown` `onMouseEnter` `onMouseLeave`
`onMouseMove` `onMouseOut` `onMouseOver` `onMouseUp`

| Event names | ... (list above)                  |
| ----------- | --------------------------------- |
| Properties  | - `boolean altKey`                |
|             | - `number button`                 |
|             | - `number buttons`                |
|             | - `number clientX`                |
|             | - `number clientY`                |
|             | - `boolean ctrlKey`               |
|             | - `boolean getModifierState(key)` |
|             | - `boolean metaKey`               |
|             | - `number pageX`                  |
|             | - `number pageY`                  |
|             | - `DOMEventTarget relatedTarget`  |
|             | - `number screenX`                |
|             | - `number screenY`                |
|             | - `boolean shiftKey`              |

#### Selection Events

| Event names | `onSelect` |
| ----------- | :--------: |
| Properties  |     –      |

#### Touch Events

| Event names | `onTouchCancel` `onTouchEnd` `onTouchMove` `onTouchStart` |
| ----------- | --------------------------------------------------------- |
| Properties  | - `boolean altKey`                                        |
|             | - `DOMTouchList changedTouches`                           |
|             | - `boolean ctrlKey`                                       |
|             | - `boolean getModifierState(key)`                         |
|             | - `boolean metaKey`                                       |
|             | - `boolean shiftKey`                                      |
|             | - `DOMTouchList targetTouches`                            |
|             | - `DOMTouchList touches`                                  |

#### UI Events

| Event names | `onScroll`               |
| ----------- | ------------------------ |
| Properties  | - `number detail`        |
|             | - `DOMAbstractView view` |

#### Wheel Events

| Event names | `onWheel`            |
| ----------- | -------------------- |
| Properties  | - `number deltaMode` |
|             | - `number deltaX`    |
|             | - `number deltaY`    |
|             | - `number deltaZ`    |

#### Media Events

`onAbort` `onCanPlay` `onCanPlayThrough` `onDurationChange` `onEmptied` `onEncrypted`
`onEnded` `onError` `onLoadedData` `onLoadedMetadata` `onLoadStart` `onPause` `onPlay`
`onPlaying` `onProgress` `onRateChange` `onSeeked` `onSeeking` `onStalled` `onSuspend`
`onTimeUpdate` `onVolumeChange` `onWaiting`

| Event names | ... (list above) |
| ----------- | :--------------: |
| Properties  |        –         |

#### Image Events

| Event names | `onLoad` `onError` |
| ----------- | ------------------ |
| Properties  |                    |

#### Animation Events

| Event names | `onAnimationStart` `onAnimationEnd` `onAnimationIteration` |
| ----------- | ---------------------------------------------------------- |
| Properties  | - `string animationName`                                   |
|             | - `string pseudoElement`                                   |
|             | - `float elapsedTime`                                      |

#### Transition Events

| Event names | `onTransitionEnd`        |
| ----------- | ------------------------ |
| Properties  | - `string propertyName`  |
|             | - `string pseudoElement` |
|             | - `float elapsedTime`    |

#### Other Events

| Event names | `onToggle` |
| ----------- | :--------: |
| Properties  |     –      |

### 18. Manipulating the State

```js
// src/App.js
//...
switchNameHandler = () => {
  // console.log('was clicked!');
  // DON'T DO THIS: this.state.persons[0].name = 'Maxime';
  // WE SHOULDN'T MUTATE STATE DIRECTLY
  this.setState({
    persons: [
      { name: 'Maxime', age: 39 },
      { name: 'Jerôme', age: 36 },
      { name: 'Morgane', age: 37 },
    ],
  });
};
//...
```

### 19. Function Components Naming

_Note about using capital letter when we create a new component._

### 20. Using the useState() Hook for State Manipulation

Since **React 16.8**, there also is a way to manage state in functional components with a feature called React Hooks.

A very important note here. `setState` replaces the old state with the new state!

When you're using **React hooks**, your function which you get as the second element (commonly call `setXXX`) in that array **does not merge whatever you pass to it with the old state**, instead **it replaces the old state with it** and this is super important because this means that whenever you're updating the state, **you have to manually make sure you include all old state data**.

```js
// src/AppHooks.js
import React, { useState } from 'react';
import './App.css';
import Person from './Person/Person';

const AppHooks = (props) => {
  const [personsState, setPersonsState] = useState({
    persons: [
      { name: 'Maxime', age: 39 },
      { name: 'Jerôme', age: 36 },
      { name: 'Morgane', age: 37 },
    ],
    otherState: 'some other value', // not recommended, but only for example purpose
  });

  const switchNameHandler = () => {
    this.setState({
      persons: [
        { name: 'Maxime', age: 39 },
        { name: 'Jerôme', age: 36 },
        { name: 'Morgane', age: 37 },
      ],
      otherState: personsState.otherState,
    });
  };

  return (
    <div className="App">
      <h1>Hi, I'm a React App!</h1>
      <button onClick={switchNameHandler}>Switch Name</button>
      <Person
        name={personsState.persons[0].name}
        age={personsState.persons[0].age}
      />
      <Person
        name={personsState.persons[1].name}
        age={personsState.persons[1].age}
      >
        My hobbies: Racing
      </Person>
      <Person
        name={personsState.persons[2].name}
        age={personsState.persons[2].age}
      />
    </div>
  );
};

export default AppHooks;
```

A more elegant solution and also recommened by React team – use `useState` **multiple times**.

```js
//...
const [personsState, setPersonsState] = useState({
  persons: [
    { name: 'Maxime', age: 39 },
    { name: 'Jerôme', age: 36 },
    { name: 'Morgane', age: 37 },
  ],
});
const [otherState, setOtherState] = useState('some other value');
//...
```

To summarize React Hooks is all about these `use` something functions with `useState` being the most important, that **allow you to add functionality to functional components**, like here `useState` allows us to **add state management to functional components**.

### 21. Stateless vs Stateful Components

A **stateful component** is a component that **manages state**, no matter if it's using the `useState` Hook or a class-based approach with the state property.

A component like `Person` int the `person.js` file is a **stateless component** because it has no internal state management.

It is a good practice to create as many of these stateless components, also called **dumb** because they don't have any internal logic. Or **presentational components** because they present something, they output content, they only get external data and output it in a structured way.

The stateful components (either class-based with state or functional with useState) are also called **smart components** or **container components** because they contain the state of your application.

You should only get a few stateful components and a lot more stateless components. Why? Because this makes your app easier to maintain and manage. You have a clear flow of data and it's very clear where your main logic sits and where your data changes => then is distributed to the rest of your app.

### 22. Passing Method References Between Components

The idea is to **pass a reference** of the method by props. You can pass methods also as props so that you can call a method which might change the state in another component which doesn't have direct access to the state and which shouldn't have direct access to the state.

```js
//...
<Person
  name={this.state.persons[1].name}
  age={this.state.persons[1].age}
  click={this.switchNameHandler}
>
  My hobbies: Racing
</Person>
//...
```

```js
import React from 'react';

const person = (props) => {
  return (
    <div>
      <p onClick={props.click}>
        I'm a {props.name} and I'm {props.age} years old!
      </p>
      <p>{props.children}</p>
    </div>
  );
};

export default person;
```

But how can we pass a parameter? Let's say we want to change the name.

1. `this.switchNameHandler.bind(this, 'Maxime')`

```js
//...
<Person
  name={this.state.persons[1].name}
  age={this.state.persons[1].age}
  click={this.switchNameHandler.bind(this, 'Maxime')}
>
  My hobbies: Racing
</Person>
//...
```

2. `() => this.switchNameHandler()`

Earlier, we said that we shouldn't call `this.switchNameHandler` with `()` and that was true but in this case this is not getting executed immediately. Instead what we pass here is **an anonymous function** which **will be executed on a click** and which then returns the result of this function getting executed. Which of course simply leads to this function getting executed.

_Note: this can be inefficient in some case, bind is recommended._

```js
//...
<Person
  name={this.state.persons[1].name}
  age={this.state.persons[1].age}
  click={() => this.switchNameHandler('Maxime!!')}
>
  My hobbies: Racing
</Person>
//...
```

### 23. Adding Two Way Binding

Let's build a method `nameChangedHandler`.

```js
// src/App.js
import React, { Component } from 'react';
import './App.css';
import Person from './Person/Person';

class App extends Component {
  state = {
    persons: [
      { name: 'Max', age: 29 },
      { name: 'Jerôme', age: 26 },
      { name: 'Morgane', age: 27 },
    ],
    otherState: 'some other value',
  };

  switchNameHandler = (newName) => {
    this.setState({
      persons: [
        { name: newName, age: 39 },
        { name: 'Jerôme', age: 36 },
        { name: 'Morgane', age: 37 },
      ],
    });
  };

  nameChangedHandler = (event) => {
    this.setState({
      persons: [
        { name: 'Max', age: 29 },
        { name: event.target.value, age: 26 },
        { name: 'Morgane', age: 27 },
      ],
    });
  };

  render() {
    return (
      <div className="App">
        <h1>Hi, I'm a React App!</h1>
        <button onClick={this.switchNameHandler.bind(this, 'Maxime1')}>
          Switch Name
        </button>
        <Person
          name={this.state.persons[0].name}
          age={this.state.persons[0].age}
        />
        <Person
          name={this.state.persons[1].name}
          age={this.state.persons[1].age}
          click={this.switchNameHandler.bind(this, 'Maxime2')}
          changed={this.nameChangedHandler}
        >
          My hobbies: Racing
        </Person>
        <Person
          name={this.state.persons[2].name}
          age={this.state.persons[2].age}
        />
      </div>
    );
  }
}

export default App;
```

```js
// src/Person.js
import React from 'react';

const person = (props) => {
  return (
    <div>
      <p onClick={props.click}>
        I'm a {props.name} and I'm {props.age} years old!
      </p>
      <p>{props.children}</p>
      <input type="text" onChange={props.changed} value={props.name} />
    </div>
  );
};

export default person;
```

### 24. Adding Styling with Stylesheets

Right now, there are two ways of styling we can implement. The first one is to add a css file. Let's create `Person.css` in the same folder than `Person.js` !! It is not scoped to Person.js, it is global css.

Don't forget to import the css in your React file.

_Note: very important detail, whichever css code we write in here **is not scoped to this `person.js`**!!_

```css
.Person {
  width: 60%;
  margin: 10px auto;
  border: 1px solid #eee;
  box-shadow: 0 2px 3px #ccc;
  padding: 16px;
  text-align: center;
}
```

```js
import React from 'react';
import './Person.css';

const person = (props) => {
  return (
    <div className="Person">
      <Content />
    </div>
  );
};

export default person;
```

How does it work? Webpack will inject globally our css (we can see it from the Google Dev tool). It will automatically prefix it to work in as many browsers as possible.

### 25. Working with Inline Styles

```js
// src/App.js

import React, { Component } from 'react';
import './App.css';
import Person from './Person/Person';

class App extends Component {
  //...

  render() {
    const style = {
      backgroundColor: 'white',
      font: 'inherit',
      border: '1px solid blue',
      padding: '8px',
      cursor: 'pointer',
    };

    return (
      <div className="App">
        <h1>Hi, I'm a React App!</h1>
        <button style={style}>Switch Name</button>
        <TheRest />
      </div>
    );
  }
}

export default App;
```

### 26. Assignment 1 – The Base Syntax
