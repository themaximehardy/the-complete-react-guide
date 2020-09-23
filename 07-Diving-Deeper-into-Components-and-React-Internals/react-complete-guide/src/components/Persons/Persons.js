// import React from 'react';
// import Person from './Person/Person';

// const Persons = ({ persons, clicked, changed }) => {
//   console.log('[Persons.js] rendering...');
//   return persons.map(({ id, name, age }, index) => {
//     return (
//       <Person
//         key={id}
//         click={() => clicked(index)}
//         name={name}
//         age={age}
//         changed={(event) => changed(event, id)}
//       />
//     );
//   });
// };
// export default Persons;

import React, { PureComponent } from 'react';
import Person from './Person/Person';

class Persons extends PureComponent {
  // static getDerivedStateFromProps(props, state) {
  //   console.log('[Persons.js] getDerivedStateFromProps – props:', props);
  //   return state;
  // }

  componentWillReceiveProps(props) {
    console.log('[Persons.js] componentWillReceiveProps – props: ', props);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('[Persons.js] shouldComponentUpdate');
  //   if (nextProps.persons !== this.props.persons) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // getSnapshotBeforeUpdate(prevProps, prevState) {
  //   console.log('[Persons.js] getSnapshotBeforeUpdate');
  //   return { message: 'Snapshot!' };
  // }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('[Persons.js] componentDidUpdate');
    console.log('[Persons.js] componentDidUpdate – snapshot: ', snapshot);
  }

  componentWillUnmount() {
    console.log('[Persons.js] componentWillUnmount');
  }

  render() {
    const { persons, clicked, changed, isAuthenticated } = this.props;
    console.log('[Persons.js] rendering...');
    return persons.map(({ id, name, age }, index) => {
      return (
        <Person
          key={id}
          click={() => clicked(index)}
          name={name}
          age={age}
          changed={(event) => changed(event, id)}
          isAuthenticated={isAuthenticated}
        />
      );
    });
  }
}
export default Persons;
