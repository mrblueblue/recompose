rx-recompose
============

[![npm version](https://img.shields.io/npm/v/recompose-relay.svg?style=flat-square)](https://www.npmjs.com/package/rx-recompose)

[RxJS](https://github.com/ReactiveX/RxJS) utilities for [Recompose](https://github.com/acdlite/recompose).

```
npm install --save rx-recompose
```

## API

### `observeProps()`

```js
observeProps(
  mapPropsStream: (props$: Observable) => Observable,
  BaseComponent: ReactElementType
): ReactElementType
```

Maps an observable stream of owner props to a stream of child props.

It turns out that much of the React Component API can be expressed in terms of observables:

- Instead of `setState()`, combine multiple streams together.
- Instead of `getIntialState()`, use `startWith()`.
- Instead of `shouldComponentUpdate()`, use `distinctUntilChanged()`, `debounce()`, etc.

Other benefits include:

- No distinction between state and props – everything is an stream.
- No need to worry about unsubscribing from event listeners. Subscriptions are handled for you.
- Sideways data loading is trivial – just combine the props stream with an external stream.
- Access to the full ecosystem of RxJS libraries.

(Examples to come.)

### `createEventHandler()`

```js
createEventHandler(): Function & Subject
```

Creates a Subject that is also a function. When called, the subject emits a new value. This type of function is ideal for passing event handlers from `observeProps()`:

```js
const Counter = observeProps(
  props$ => {
    const increment$ = createEventHandler();
    const decrement$ = createEventHandler();

    const count$ = Observable.merge(
        increment$.map(() => 1),
        decrement$.map(() => -1)
      )
      .startWith(0)
      .scan((count, n) => count + n);

    return Observable.combineLatest(
      props$, count$,
      (props, count) => ({
        increment: increment$,
        decrement: decrement$,
        count,
        ...props
      })
    );
  },
  ({ count, increment, ...props }) => {
    <div {...props}>
      Count: {counter}
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  }
);
```
