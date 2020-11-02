import reducer from './auth';
import * as actionTypes from '../actions/actionTypes';

describe('auth reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      token: null,
      userId: null,
      error: null,
      loading: false,
      authRedirectPath: '/',
    });
  });

  it('should store the token upon login', () => {
    expect(
      reducer(
        {
          token: null,
          userId: null,
          error: null,
          loading: false,
          authRedirectPath: '/',
        },
        {
          type: actionTypes.AUTH_SUCCESS,
          payload: { idToken: 'someIdToken', userId: 'someUserId' },
        },
      ),
    ).toEqual({
      token: 'someIdToken',
      userId: 'someUserId',
      error: null,
      loading: false,
      authRedirectPath: '/',
    });
  });
});
