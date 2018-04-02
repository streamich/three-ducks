import {createStore} from '..'
import pluginDispatch from '../plugins/dispatch'
import pluginReducer from '../plugins/reducer'
import pluginGetState from '../plugins/getState'
import pluginReplaceReducer from '../plugins/replaceReducer'
import pluginSubscribe from '../plugins/subscribe'
import pluginObservable from '../plugins/observable'

const createReduxStore = (reducer, preloadedState, enhancer) => {
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  if (typeof enhancer !== 'undefined') {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof enhancer !== 'function') {
        throw new Error('Expected the enhancer to be a function.')
      }
    }

    return enhancer(createReduxStore)(reducer, preloadedState)
  }

  if (process.env.NODE_ENV !== 'production') {
    if (typeof reducer !== 'function') {
      throw new Error('Expected the reducer to be a function.')
    }
  }

  const store = createStore(preloadedState, [
    pluginDispatch(),
    pluginReducer(reducer),
    pluginGetState(),
    pluginReplaceReducer(),
    pluginSubscribe(),
    pluginObservable()
  ])

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  store.dispatch({
    type: '@@redux/INIT' + Math.random().toString(36).substring(7).split('').join('.')
  })

  return store
}

export default createReduxStore
