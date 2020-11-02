import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = (name) => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    payload: {
      ingredientName: name,
    },
  };
};

export const removeIngredient = (name) => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    payload: {
      ingredientName: name,
    },
  };
};

export const setIngredients = (ingredients) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    payload: {
      ingredients,
    },
  };
};

export const fetchIngredientsFailed = () => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED,
  };
};

export const initIngredient = () => {
  return (dispatch) => {
    axios
      .get('/ingredients.json')
      .then((response) => {
        dispatch(setIngredients(response.data));
      })
      .catch((error) => {
        console.log('error: ', error);
        dispatch(fetchIngredientsFailed());
      });
  };
};
