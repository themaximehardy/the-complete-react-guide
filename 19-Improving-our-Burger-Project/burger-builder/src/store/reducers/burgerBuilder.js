import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utilty';

const initialState = {
  ingredients: null,
  totalPrice: 4,
  error: false,
  building: false,
};

const INGREDIENT_PRICE = {
  salad: 0.5,
  bacon: 0.7,
  cheese: 0.4,
  meat: 1.3,
};

const addIngredient = (state, action) => {
  const updatedIngredientAI = {
    [action.payload.ingredientName]:
      state.ingredients[action.payload.ingredientName] + 1,
  };
  const updatedIngredientsAI = updateObject(
    state.ingredients,
    updatedIngredientAI,
  );
  const updatedStateAI = {
    ingredients: updatedIngredientsAI,
    totalPrice:
      state.totalPrice + INGREDIENT_PRICE[action.payload.ingredientName],
    building: true,
  };
  return updateObject(state, updatedStateAI);
};

const removeIngredient = (state, action) => {
  const updatedIngredientRI = {
    [action.payload.ingredientName]:
      state.ingredients[action.payload.ingredientName] - 1,
  };
  const updatedIngredientsRI = updateObject(
    state.ingredients,
    updatedIngredientRI,
  );
  const updatedStateRI = {
    ingredients: updatedIngredientsRI,
    totalPrice:
      state.totalPrice + INGREDIENT_PRICE[action.payload.ingredientName],
    building: true,
  };
  return updateObject(state, updatedStateRI);
};

const setIngredients = (state, action) => {
  return updateObject(state, {
    ingredients: action.payload.ingredients,
    totalPrice: 4,
    error: false,
    building: false,
  });
};

const fetchIngredientsFailed = (state, _action) => {
  return updateObject(state, { error: true });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      return addIngredient(state, action);
    case actionTypes.REMOVE_INGREDIENT:
      return removeIngredient(state, action);
    case actionTypes.SET_INGREDIENTS:
      return setIngredients(state, action);
    case actionTypes.FETCH_INGREDIENTS_FAILED:
      return fetchIngredientsFailed(state, action);
    default:
      return state;
  }
};

export default reducer;
