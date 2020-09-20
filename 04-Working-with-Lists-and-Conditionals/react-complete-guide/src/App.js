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

    const person = {
      ...this.state.persons[personIndex],
    };

    // const person = Object.assign({}, this.state.persons[personIndex]); // same as above

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
    const style = {
      backgroundColor: 'white',
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
    }

    return (
      <div className="App">
        <h1>Hi, I'm a React App!</h1>
        <button style={style} onClick={this.togglePersonsHandler}>
          Switch Name
        </button>
        {persons}
      </div>
    );
  }
}

export default App;
