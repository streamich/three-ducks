# `thunk` Plugin

Allows your action creators to return functions, which return an action. Install
this plugin before `reducer` plugin.

```js
import {createStore} from 'three-ducks';
import pluginDispatch from 'three-ducks/lib/plugins/dispatch';
import pluginThunk from 'three-ducks/lib/plugins/thunk';
import pluginReducer from 'three-ducks/lib/plugins/reducer';

const store = createStore({}, [
  pluginDispatch(),
  pluginThunk()
  pluginReducer(reducer),
]);

const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

function increment() {
  return {
    type: INCREMENT_COUNTER
  };
}

function incrementAsync({dispatch}) {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment());
    }, 1000);
  };
}

store.dispatch(incrementAsync());
```
