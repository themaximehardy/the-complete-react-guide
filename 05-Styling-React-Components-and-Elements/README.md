# Styling React Components & Elements

_Useful Resources & Links_

- [Using CSS Modules in create-react-app Projects](https://medium.com/nulogy/how-to-use-css-modules-with-create-react-app-9e44bec2b5c2)
- [More information about CSS Modules](https://github.com/css-modules/css-modules)

### 1. Introduction

We've have seen how to apply style via **inline style** or by adding and importing a **css file**. Let's dive deeper in how we could do it better.

### 2. Outlining the Problem Set

The pros and cons with inline styling –

We can't use pseudo selectors (for example: `button:hover: {...}`)! But the advantage is the styling is only applied to this button and nothing else. The scope is not global.

The alternative is to use css file. But then the scope of our style is global.

What if we actually want to change styling dynamically?

### 3. Setting Styles Dynamically

```js
//...
render() {
  const style = {
    backgroundColor: 'green',
    color: 'white',
    font: 'inherit',
    border: '1px solid blue',
    padding: '8px',
    cursor: 'pointer',
  };

  let persons = null;

  if (this.state.showPersons) {
    persons = (
      <div>
        {this.state.persons.map(({ id, name, age }, index) => {
          return (
            <Person
              key={id}
              click={() => this.deletePersonHandler(index)}
              name={name}
              age={age}
              changed={(event) => this.nameChangedHandler(event, id)}
            />
          );
        })}
      </div>
    );
    style.backgroundColor = 'red';
  }

  return (...)
  }
}
//...
```

### 4. Setting Class Names Dynamically

```js
// src/App.js
import React, { Component } from 'react';
import './App.css';
import Person from './Person/Person';

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

  //...

  render() {
    //...
    let classes = [];

    if (this.state.persons.length <= 2) {
      classes.push('red');
    }

    if (this.state.persons.length <= 1) {
      classes.push('bold');
    }

    return (
      <div className="App">
        <h1>Hi, I'm a React App!</h1>
        <p className={classes.join(' ')}>This is really working!</p>
        <button style={style} onClick={this.togglePersonsHandler}>
          Switch Name
        </button>
        {persons}
      </div>
    );
  }
}

export default App;
```

### 5. Adding and Using Radium

It would be nice if we could use **pseudo selectors** and **media queries** in our **normal javascript inline styles**, and by default that's not possible, but we can add a third party package which is pretty popular to add this functionality to our application – [Radium](https://www.npmjs.com/package/radium).

> Radium is a set of tools to manage inline styles on React elements. It gives you powerful styling capabilities without CSS.

`yarn add -D radium`

```js
import Radium from 'radium';
//...
export default Radium(App);
```

We need to call Radium as a function and wrap our App with it. It is called a [**higher-order component**](https://reactjs.org/docs/higher-order-components.html) (or **HOC**). To simplify it is a component wrapping our component adding kind of injecting some extra functionalities. In our case some extra syntax which will parse your styles and understand some extra features.

```js
// src/App.js
import React, { Component } from 'react';
import Radium from 'radium';
import Person from './Person/Person';
import './App.css';

class App extends Component {
  state = {
    ...
  };

  //...

  render() {
    const style = {
      backgroundColor: 'green',
      color: 'white',
      font: 'inherit',
      border: '1px solid blue',
      padding: '8px',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: 'lightgreen',
        color: 'black',
      },
    };

    //...

    if (this.state.showPersons) {
      //...
      style.backgroundColor = 'red';
      style[':hover'] = {
        backgroundColor: 'salmon',
        color: 'black',
      };
    }

    let classes = [];
    if (this.state.persons.length <= 2) {
      classes.push('red');
    }

    if (this.state.persons.length <= 1) {
      classes.push('bold');
    }

    return (
      <div className="App">
        <h1>Hi, I'm a React App!</h1>
        <p className={classes.join(' ')}>This is really working!</p>
        <button style={style} onClick={this.togglePersonsHandler}>
          Switch Name
        </button>
        {persons}
      </div>
    );
  }
}

export default Radium(App);
```

### 6. Using Radium for Media Queries

You could write a media query in your css file.

```css
@media (min-width: 500px) {
  .Person {
    width: 450px;
  }
}
```

But we want to do it with radium which we might need in some occasions. If we want to **scope it to a component** or if we want to **change it dynamically**.

```js
// src/Person/Person.js
import React from 'react';
import Radium from 'radium';
import './Person.css';

const person = (props) => {
  const style = {
    '@media (min-width: 500px)': {
      width: '450px',
    },
  };

  return (
    <div className="Person" style={style}>
      <p onClick={props.click}>
        I'm a {props.name} and I'm {props.age} years old!
      </p>
      <p>{props.children}</p>
      <input type="text" onChange={props.changed} value={props.name} />
    </div>
  );
};

export default Radium(person);
```

```js
import React, { Component } from 'react';
import Radium, { StyleRoot } from 'radium';
import Person from './Person/Person';
import './App.css';

class App extends Component {
  //...

  render() {
    //...
    return (
      <StyleRoot>
        <div className="App">
          {...}
        </div>
      </StyleRoot>
    );
  }
}

export default Radium(App);
```

### 7. Introducing Styled Components

We had a look at `radium` which is one package that helps us with styling React Components. Another very popular package and third party library we can use is the [`styled components`](https://styled-components.com/) library.

`yarn add styled-components`

```js
import React from 'react';
import styled from 'styled-components';

const StyleDiv = styled.div`
  width: 60%;
  margin: 10px auto;
  border: 1px solid #eee;
  box-shadow: 0 2px 3px #ccc;
  padding: 16px;
  text-align: center;

  @media (min-width: 500px) {
    width: 450px;
  }
`;

const person = (props) => {
  return (
    <StyleDiv>
      <p onClick={props.click}>
        I'm a {props.name} and I'm {props.age} years old!
      </p>
      <p>{props.children}</p>
      <input type="text" onChange={props.changed} value={props.name} />
    </StyleDiv>
  );
};

export default person;
```

Here we can see we have a **style component scoped**, we can use **pseudo selectors** and **media queries**!

### 8. More on Styled Components

Behind the scene, `styled components` handles our styles **not as inline styles** but instead it takes them and it puts them into class selectors (with random names) and adds them to the head of document. It adds the appropriate css selector as class to the div which is returned by this component or which is created as part of this component.Because with inline styles which can have certain disadvantages. For example we're not really taking advantage of the cascading nature of css.

```js
// src/App.js
import React, { Component } from 'react';
import styled from 'styled-components';
import Person from './Person/Person';

const StyledButton = styled.button`
  background-color: green;
  color: white;
  font: inherit;
  border: 1px solid blue;
  padding: 8px;
  cursor: pointer;

  &:hover {
    background-color: lightgreen;
    color: black;
  }
`;

class App extends Component {
  //...

  render() {
    //...

    return (
      <div className="App">
        <h1>Hi, I'm a React App!</h1>
        <p className={classes.join(' ')}>This is really working!</p>
        <StyledButton onClick={this.togglePersonsHandler}>
          Switch Name
        </StyledButton>
        {persons}
      </div>
    );
  }
}

export default App;
```

### 9. Styled Components & Dynamic Styles

We can pass `props` to our styled component as below:

```js
// src/App.js
import React, { Component } from 'react';
import styled from 'styled-components';
import Person from './Person/Person';

const StyledButton = styled.button`
  background-color: ${(props) => (props.alt ? 'red' : 'green')};
  color: white;
  font: inherit;
  border: 1px solid blue;
  padding: 8px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.alt ? 'salmon' : 'lightgreen')};
    color: black;
  }
`;

class App extends Component {
  state = {
    //...
    showPersons: false,
  };
  //...
  render() {
    //...
    return (
      <div className="App">
        <h1>Hi, I'm a React App!</h1>
        <p className={classes.join(' ')}>This is really working!</p>
        <StyledButton
          alt={this.state.showPersons}
          onClick={this.togglePersonsHandler}
        >
          Switch Name
        </StyledButton>
        {persons}
      </div>
    );
  }
}

export default App;
```

### 10. Working with CSS Modules

Styled components is great but in the same time, it mixes css and JavaScript in the same file make things a bit less readable, we have extra code and porr IDE support when we write our css. It would be great to have another way to scope our style to our components. Writing styles which only apply to a specific component instead of the entire application.

Let's see **CSS modules**. We need to tweak the config to make it work.

### 11. CSS Modules & Media Queries

### 12. More on CSS Modules
