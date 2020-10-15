import * as actionTypes from '../actions';

const initialState = {
  results: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.STORE_RESULT:
      return {
        ...state,
        results: state.results.concat({
          value: action.payload.result,
          id: new Date(),
        }), // push manipulates the original value... we use concat which is the immutable way of doing it
      };
    case actionTypes.DELETE_RESULT:
      // filter returns a new array!!
      const updatedArray = state.results.filter(
        (result) => result.id !== action.payload.id,
      );
      return {
        ...state,
        results: updatedArray,
      };
    default:
      return state;
  }
};

export default reducer;
