import * as actionTypes from './actions';

const initialState = {
  persons: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_PERSON:
      const newPerson = {
        id: Math.random(), // not really unique but good enough here!
        name: action.payload.name,
        age: action.payload.age,
      };
      return {
        ...state,
        persons: state.persons.concat(newPerson),
      };
    case actionTypes.DELETE_PERSON:
      return {
        ...state,
        persons: state.persons.filter(
          (person) => person.id !== action.payload.id,
        ),
      };
    default:
      return state;
  }
};

export default reducer;
