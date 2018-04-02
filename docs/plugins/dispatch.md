# `dispatch` Plugin

Adds `.dispatch()` method to your store.

Usage:


```js
import {createStore} from 'three-ducks';
import pluginDispatch from 'three-ducks/lib/plugins/dispatch';

const store = createStore({}, [
  pluginDispatch(),
]);
```
