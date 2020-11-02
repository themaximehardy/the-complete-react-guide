import React from 'react';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import classes from './Burger.css';

const Burger = ({ ingredients = {} }) => {
  let transformedIngredients = Object.keys(ingredients)
    .map((igKey) => {
      return [...Array(ingredients[igKey])].map((_, idx) => {
        return <BurgerIngredient key={igKey + idx} type={igKey} />;
      });
    })
    // before reduce we could have [[], [], [], []] if we pass 0 value to our ingredients
    .reduce((acc, cur) => {
      return acc.concat(cur);
    }, []);

  if (!transformedIngredients.length) {
    transformedIngredients = <p>Please start adding ingredients!</p>;
  }
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom" />
    </div>
  );
};

export default Burger;
