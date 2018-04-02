# three-ducks

[![][npm-badge]][npm-url] [![][travis-badge]][travis-url]

Tiny Redux clone with plugins.

- __Tiny__ &mdash; core is only 5 lines of code
- __All Redux APIs__ &mdash; `.subscribe()`, `.getState()`, `.dispatch()`, etc. &mdash; as separate plugins
- __Faster than Redux__ &mdahs; see [benchmark results](#benchmark)
- __100% Compatible__ &mdash; works with [`react-redux`](https://github.com/reactjs/react-redux), passes [Redux `createStore()` test suite](./src/presets/__tests__/reduxSpec.test.js)
- __Public domain__ &mdash; [Unlicense license](./LICENSE)


## Reference

- [Installation](./docs/Installation.md)
- [Plugins](./docs/Plugins.md)
  - [`dispatch`](./docs/plugins/dispatch.md)
  - [`reducer`](./docs/plugins/reducer.md)
  - [`subscribe`](./docs/plugins/subscribe.md)
  - [`replaceReducer`](./docs/plugins/replaceReducer.md)
  - [`getState`](./docs/plugins/replaceReducer.md)
  - [`observable`](./docs/plugins/observable.md)
- [Presets](./docs/Presets.md)
  - [`redux`](/docs/presets/redux.md)


## Benchmark

Running a very basic counter micro-benchmark.

```
three-ducks (with redux preset) x 1,076 ops/sec ±2.58% (47 runs sampled)
index.js:48 redux x 494 ops/sec ±4.40% (43 runs sampled)
index.js:51 Fastest is three-ducks (with redux preset)
```


## See also

- [`nano-css`](https://github.com/streamich/nano-css) &mdash; Distilled CSS-in-JS for gourmet developers


[npm-url]: https://www.npmjs.com/package/three-ducks
[npm-badge]: https://img.shields.io/npm/v/three-ducks.svg
[travis-url]: https://travis-ci.org/streamich/three-ducks
[travis-badge]: https://travis-ci.org/streamich/three-ducks.svg?branch=master
