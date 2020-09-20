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
    // console.log('was clicked!');
    // DON'T DO THIS: this.state.persons[0].name = 'Maxime';
    // WE SHOULDN'T MUTATE STATE DIRECTLY
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
        <button
          style={style}
          onClick={this.switchNameHandler.bind(this, 'Maxime1')}
        >
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
