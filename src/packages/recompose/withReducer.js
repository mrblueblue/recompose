import { Component } from 'react';
import curry from 'lodash/function/curry';
import isFunction from 'lodash/lang/isFunction';
import wrapDisplayName from './wrapDisplayName';
import createElement from './createElement';

const withReducer = (
  stateName,
  dispatchName,
  reducer,
  initialState,
  BaseComponent
) => (
  class extends Component {
    static displayName = wrapDisplayName(BaseComponent, 'withReducer');

    state = {
      stateValue: isFunction(initialState)
        ? initialState(this.props)
        : initialState
    };

    dispatch = action => this.setState(({ stateValue }) => ({
      stateValue: reducer(stateValue, action)
    }));

    render() {
      return createElement(BaseComponent, {
        ...this.props,
        [stateName]: this.state.stateValue,
        [dispatchName]: this.dispatch
      });
    }
  }
);

export default curry(withReducer);
