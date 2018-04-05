import {createStore} from '../../'
import pluginDipatch from '../dispatch'
import pluginReducer from '../reducer'
import pluginRematch from '../rematch'

const createStoreWithPlugins = (reducer = state => state) => {
  return createStore({}, [
    pluginDipatch(),
    pluginReducer(reducer),
    pluginRematch()
  ])
}

describe('plugin', () => {
  describe('rematch', () => {
    it('exists', () => {
      expect(typeof pluginRematch).toBe('function')
    })

    it('exposes .rematch() method', () => {
      const store = createStoreWithPlugins()

      expect(typeof store.rematch).toBe('function')
    })

    it('adds action dispatcher to .dispatch() method', () => {
      const store = createStoreWithPlugins()

      store.rematch({
        state: 0,
        reducers: {
          increment: (state, value) => state + value
        }
      }, 'counter')

      expect(typeof store.dispatch.counter).toBe('object')
      expect(typeof store.dispatch.counter.increment).toBe('function')
    })

    it('works', () => {
      const store = createStoreWithPlugins()

      store.rematch({
        name: 'counter',
        state: 0,
        reducers: {
          increment: (state, value) => {
            return state + value
          }
        }
      })

      store.dispatch.counter.increment(3)

      expect(store.state).toEqual({
        counter: 3
      })
    })
  })
})
