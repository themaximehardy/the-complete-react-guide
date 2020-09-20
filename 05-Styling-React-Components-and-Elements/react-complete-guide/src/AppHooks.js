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
  });
  const [otherState, setOtherState] = useState('some other value');

  const switchNameHandler = () => {
    this.setState({
      persons: [
        { name: 'Maxime', age: 39 },
        { name: 'Jerôme', age: 36 },
        { name: 'Morgane', age: 37 },
      ],
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
