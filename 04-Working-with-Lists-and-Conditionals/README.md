# Working with Lists and Conditionals

_Useful Resources & Links_

- [Conditional Rendering](https://reactjs.org/docs/conditional-rendering.html)
- [Lists & Keys](https://reactjs.org/docs/lists-and-keys.html)

### 1. Introduction

In this module, we'll have a look at how to **output content conditionally** but also how to **output lists**.

### 2. Rendering Content Conditionally

```js
import React, { Component } from 'react';
import './App.css';
import Person from './Person/Person';

class App extends Component {
  state = {
    //...
    showPersons: false,
  };

  //...
  togglePersonsHandler = () => {
    const doesShow = this.state.showPersons;
    this.setState({ showPersons: !doesShow });
  };

  render() {
    //...
    return (
      <div className="App">
        {...}
        {this.state.showPersons ? (
          <div>
            <Person
              name={this.state.persons[0].name}
              age={this.state.persons[0].age}
            />
            {...}
          </div>
        ) : null}
      </div>
    );
  }
}

export default App;
```

```js
{
  this.state.showPersons ? <div>true</div> : null;
}
// OR
{
  this.state.showPersons && <div>true</div>;
}
```

### 3. Handling Dynamic Content "The JavaScript Way"

Everything in the render method is executed each time the state or a prop change. We could use variables to handle the dynamic content.

```js
// src/App.js
import React, { Component } from 'react';
import './App.css';
import Person from './Person/Person';

class App extends Component {
  state = {
    showPersons: false,
  };

  togglePersonsHandler = () => {
    const doesShow = this.state.showPersons;
    this.setState({ showPersons: !doesShow });
  };

  render() {
    let persons = null;

    if (this.state.showPersons) {
      persons = (
        <div>
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

    return (
      <div className="App">
        <h1>Hi, I'm a React App!</h1>
        <button onClick={this.togglePersonsHandler}>Switch Name</button>
        {persons}
      </div>
    );
  }
}

export default App;
```

### 4. Outputting Lists

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

  togglePersonsHandler = () => {
    const doesShow = this.state.showPersons;
    this.setState({ showPersons: !doesShow });
  };

  render() {
    let persons = null;

    if (this.state.showPersons) {
      persons = (
        <div>
          {this.state.persons.map(({ name, age }) => {
            return <Person key={name} name={name} age={age} />;
          })}
        </div>
      );
    }

    return (
      <div className="App">
        <h1>Hi, I'm a React App!</h1>
        <button onClick={this.togglePersonsHandler}>Switch Name</button>
        {persons}
      </div>
    );
  }
}

export default App;
```

We used `map`, where we returned an new array of Person component.

```js
if (this.state.showPersons) {
  persons = (
    <div>
      {this.state.persons.map(({ name, age }) => {
        return <Person key={name} name={name} age={age} />;
      })}
    </div>
  );
}
```

### 5. Lists & State

!! Be careful, the next approach has a flaw – We can't mutate our state. Arrays and objects are reference. If we change the the arrays or the objects, then we modify the original arrays or objects managed by React. This can lead to unpredictable apps and is definitely a bad practice.

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

  deletePersonHandler = (personIndex) => {
    const persons = this.state.persons;
    persons.splice(personIndex, 1); // WE CAN'T CHANGE THE STATE LIKE THIS, HERE WE MUTATED OUR OBJECT
    this.setState({ persons });
  };

  render() {
    let persons = null;

    if (this.state.showPersons) {
      persons = (
        <div>
          {this.state.persons.map(({ name, age }, index) => {
            return (
              <Person
                key={index}
                click={() => this.deletePersonHandler(index)}
                name={name}
                age={age}
              />
            );
          })}
        </div>
      );
    }

    return (
      <div className="App">
        <h1>Hi, I'm a React App!</h1>
        <button onClick={this.togglePersonsHandler}>Switch Name</button>
        {persons}
      </div>
    );
  }
}

export default App;
```

### 6. Updating State Immutably

First, we should create a copy of our array `const persons = this.state.persons.slice();` or a new approach (ES6) `const persons = [...this.state.persons];`.

```js
deletePersonHandler = (personIndex) => {
  // const persons = this.state.persons.slice(); // create a copy
  const persons = [...this.state.persons]; // similar than the slice above, it creates a copy
  persons.splice(personIndex, 1);
  this.setState({ persons });
};
```

### 7. Lists & Keys

The `key` property helps react update the list efficiently. `index` is not a good key, if the list changes, every element will receive a new index at least every element after the change.

### 8. Flexible Lists

Let's focus on the `nameChangedHandler` method. We can update the state without mutate the original array.

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
  };

  deletePersonHandler = (personIndex) => {
    // const persons = this.state.persons.slice(); // create a copy
    const persons = [...this.state.persons]; // similar than the slice above, it creates a copy
    persons.splice(personIndex, 1);
    this.setState({ persons });
  };

  nameChangedHandler = (event, id) => {
    const personIndex = this.state.persons.findIndex((person) => {
      return person.id === id;
    });

    // const person = Object.assign({}, this.state.persons[personIndex]); // same as below

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
    }

    return (
      <div className="App">
        <h1>Hi, I'm a React App!</h1>
        <button onClick={this.togglePersonsHandler}>Switch Name</button>
        {persons}
      </div>
    );
  }
}

export default App;
```

### 9. Assigment 2: Lists & Conditionals
