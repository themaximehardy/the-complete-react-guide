import React, { Component } from 'react';
import { connect } from 'react-redux';

import CounterControl from '../../components/CounterControl/CounterControl';
import CounterOutput from '../../components/CounterOutput/CounterOutput';
import * as actionTypes from '../../store/actions';

class Counter extends Component {
  state = {
    counter: 0,
  };

  render() {
    return (
      <div>
        <CounterOutput value={this.props.ctr} />
        <CounterControl
          label="Increment"
          clicked={this.props.onIncrementCounter}
        />
        <CounterControl
          label="Decrement"
          clicked={this.props.onDecrementCounter}
        />
        <CounterControl
          label="Add 5"
          clicked={() => this.props.onAddCounter(5)}
        />
        <CounterControl
          label="Subtract 5"
          clicked={() => this.props.onSubstractCounter(5)}
        />
        <hr />
        <button onClick={() => this.props.onStoreResult(this.props.ctr)}>
          Store Result
        </button>
        <ul>
          {this.props.storedResults.map((result) => (
            <li
              key={result.id}
              onClick={() => this.props.onDeleteResult(result.id)}
            >
              {result.value}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ctr: state.ctr.counter,
    storedResults: state.res.results,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIncrementCounter: () =>
      dispatch({
        type: actionTypes.INCREMENT,
      }),
    onDecrementCounter: () =>
      dispatch({
        type: actionTypes.DECREMENT,
      }),
    onAddCounter: (value) =>
      dispatch({
        type: actionTypes.ADD,
        payload: {
          value,
        },
      }),
    onSubstractCounter: (value) =>
      dispatch({
        type: actionTypes.SUBSTRACT,
        payload: {
          value,
        },
      }),
    onStoreResult: (result) =>
      dispatch({
        type: actionTypes.STORE_RESULT,
        payload: {
          result,
        },
      }),
    onDeleteResult: (id) =>
      dispatch({
        type: 'DELETE_RESULT',
        payload: {
          id,
        },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
