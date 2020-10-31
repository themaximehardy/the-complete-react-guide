import React, { Component } from 'react';
import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
  render() {
    const {
      price,
      ingredients,
      purchaseCanceled,
      purchaseContinued,
    } = this.props;
    const ingredientSummary = Object.keys(ingredients).map((igKey, idx) => {
      return (
        <li key={igKey + idx}>
          <span style={{ textTransform: 'capitalize' }}>{igKey}</span>:{' '}
          {ingredients[igKey]}
        </li>
      );
    });
    return (
      <Aux>
        <h3>Your Order</h3>
        <p>Delicious burger with the following ingredients: </p>
        <ul>{ingredientSummary}</ul>
        <p>
          Total price: <strong>{price.toFixed(2)}</strong>
        </p>
        <p>Continue to Checkout</p>
        <Button btnType="Danger" clicked={purchaseCanceled}>
          CANCEL
        </Button>
        <Button btnType="Success" clicked={purchaseContinued}>
          CONTINUE
        </Button>
      </Aux>
    );
  }
}

export default OrderSummary;
