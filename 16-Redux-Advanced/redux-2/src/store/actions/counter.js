import * as actionTypes from './actionTypes';

// ACTION CREATORS
export const increment = () => {
  return {
    type: actionTypes.INCREMENT,
  };
};

export const add = (value) => {
  return {
    type: actionTypes.ADD,
    payload: {
      value,
    },
  };
};

export const decrement = () => {
  return {
    type: actionTypes.DECREMENT,
  };
};

export const substract = (value) => {
  return {
    type: actionTypes.SUBSTRACT,
    payload: {
      value,
    },
  };
};
