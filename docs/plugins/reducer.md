# `reducer` Plugin

Adds root reducer to your store to be ran after each "dispatch".

Usage:


```js
import {createStore} from 'three-ducks';
import pluginDispatch from 'three-ducks/lib/plugins/dispatch';
import pluginReducer from 'three-ducks/lib/plugins/reducer';

const store = createStore({}, [
  pluginDispatch(),
  pluginReducer(reducer),
]);
```

, where `reducer` is your reducer function.

