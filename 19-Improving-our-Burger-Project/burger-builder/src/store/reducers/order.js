import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utilty';

const initialState = {
  orders: [],
  loading: false,
  purchased: false,
};

const purchaseInit = (state, _action) => {
  return updateObject(state, { purchased: false });
};

const purchaseBurgerSuccess = (state, action) => {
  const newOrder = updateObject(action.payload.orderData, {
    id: action.payload.orderId,
  });

  return updateObject(state, {
    loading: false,
    orders: state.orders.concat(newOrder),
    purchased: true,
  });
};

const fetchOrdersSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    orders: action.payload.orders,
  });
};

const handleStart = (state, _action) => {
  return updateObject(state, { loading: true });
};

const handleFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.payload.error,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PURCHASE_INIT:
      return purchaseInit(state, action);
    case actionTypes.FETCH_ORDERS_START:
    case actionTypes.PURCHASE_BURGER_START:
      return handleStart(state, action);
    case actionTypes.PURCHASE_BURGER_SUCCESS:
      return purchaseBurgerSuccess(state, action);
    case actionTypes.FETCH_ORDERS_FAIL:
    case actionTypes.PURCHASE_BURGER_FAIL:
      return handleFail(state, action);
    case actionTypes.FETCH_ORDERS_SUCCESS:
      return fetchOrdersSuccess(state, action);
    default:
      return state;
  }
};

export default reducer;
