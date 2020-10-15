import React, { Component } from 'react';
import { connect } from 'react-redux'; // 6 – import `connect` from `react-redux`

import Person from '../components/Person/Person';
import AddPerson from '../components/AddPerson/AddPerson';
import * as actionTypes from '../store/actions'; // 12 – import `actionTypes` from the store

class Persons extends Component {
  state = {
    persons: [],
  };

  render() {
    return (
      <div>
        <AddPerson personAdded={this.props.personAddedHandler} />
        {this.props.persons.map((person) => (
          <Person
            key={person.id}
            name={person.name}
            age={person.age}
            clicked={() => this.props.personDeletedHandler(person.id)}
          />
        ))}
      </div>
    );
  }
}

// 8 – create a mapStateToProps constant to get access to the state we want
const mapStateToProps = (state) => {
  return {
    persons: state.persons,
  };
};

// 10 – create a mapStateToProps constant to dispatch actions to the reducer
const mapDispatchToProps = (dispatch) => {
  return {
    personAddedHandler: (name, age) =>
      dispatch({
        type: actionTypes.ADD_PERSON,
        payload: {
          name,
          age,
        },
      }),
    personDeletedHandler: (id) =>
      dispatch({
        type: actionTypes.DELETE_PERSON,
        payload: {
          id,
        },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Persons);

// 7 – (below) use the HOC `connect` to set up the subscription to our newly created store
// export default connect()(Persons);

// 9 – (below) add mapStateToProps (as a first param in connect)
// export default connect(mapStateToProps)(Persons);

// 11 – (below) add mapDispatchToProps (as a second param in connect)
// export default connect(mapStateToProps, mapDispatchToProps)(Persons);
