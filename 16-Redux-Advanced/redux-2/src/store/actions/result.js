import * as actionTypes from './actionTypes';

// ACTION CREATORS
// SYNC
export const storeResultSync = (result) => {
  return {
    type: actionTypes.STORE_RESULT,
    payload: {
      result,
    },
  };
};

// ASYNC (which dispatch the storeResultSync SYNC below)
export const storeResult = (result) => {
  // because of redux-thunk middleware we have access to dispatch
  return (dispatch, getState) => {
    // our async method here
    setTimeout(() => {
      const oldCounter = getState().ctr.counter;
      console.log(oldCounter);
      dispatch(storeResultSync(result));
    }, 2000);
  };
};

export const deleteResult = (id) => {
  return {
    type: actionTypes.DELETE_RESULT,
    payload: {
      id,
    },
  };
};
