# Installation

Install `three-ducks`.

<pre>
npm i <a href="https://www.npmjs.com/package/three-ducks">three-ducks</a> --save
</pre>


Create a new store using `createStore` utility.

```js
import {createStore} from 'three-ducks';

const store = createStore({}, [
  // plugins
]);
```

You use `three-ducks` with [plugins](./Plugins.md), without plugins it cannot do anything.

```js
import {createStore} from 'three-ducks';
import pluginDispatch from 'three-ducks/lib/plugins/dispatch';
import pluginReducer from 'three-ducks/lib/plugins/reducer';
import pluginSubscribe from 'three-ducks/lib/plugins/subscribe';

const store = createStore({}, [
  pluginDispatch(),
  pluginReducer(reducer),
  pluginSubscribe(),
]);
```

To avoid installing plugins manually, pick one of the [presets](./Presets.md), such as *"Redux"*:

```js
import createStore from 'three-ducks/lib/presets/redux';

// Use it the same as Redux's createStore()
const store = createStore(reducer, initialState, enhancer);
```
