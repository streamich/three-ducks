# Plugins

`three-ducks` is all about plugins, all its functionality is in its plugins, which
can be found in `three-ducks/lib/plugins/` folder.

- [`dispatch`](./plugins/dispatch.md) &mdash; adds `.dispatch()` method
- [`reducer`](./plugins/reducer.md) &mdash; sets a reducer middleware to run on each "dispatch"
- [`subscribe`](./plugins/subscribe.md) &mdash; adds `.subscribe()` method
- [`replaceReducer`](./plugins/replaceReducer.md) &mdash; adds `.replaceReducer()` method
- [`getState`](./plugins/getState.md) &mdash; adds `.getState()` method
- [`observable`](./plugins/observable.md) &mdash; makes store an [observable](https://github.com/tc39/proposal-observable)
- [`thunk`](./plugins/thunk.md) &mdash; similar to [`redux-thunk`](https://github.com/gaearon/redux-thunk) package
