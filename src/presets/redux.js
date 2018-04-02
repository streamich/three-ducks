import {createStore} from '..'
import pluginDispatch from '../plugins/dispatch'
import pluginReducer from '../plugins/reducer'
import pluginGetState from '../plugins/getState'
import pluginReplaceReducer from '../plugins/replaceReducer'
import pluginSubscribe from '../plugins/subscribe'

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

  return createStore(preloadedState, [
    pluginDispatch(),
    pluginReducer(reducer),
    pluginGetState(),
    pluginReplaceReducer(),
    pluginSubscribe()
  ])
}

export default createReduxStore
