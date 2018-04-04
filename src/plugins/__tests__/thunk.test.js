import {createStore} from '../../'
import pluginDipatch from '../dispatch'
import pluginReducer from '../reducer'
import pluginThunk from '../thunk'

const createStoreWithPlugin = (reducer = state => state) => {
  return createStore({}, [
    pluginDipatch(),
    pluginThunk(),
    pluginReducer(reducer)
  ])
}

describe('plugin', () => {
  describe('thunk', () => {
    it('exists', () => {
      expect(typeof pluginThunk).toBe('function')
    })

    it('does not crash', () => {
      createStoreWithPlugin()
    })

    it('can pass a function as an action', () => {
      const store = createStoreWithPlugin()

      store.dispatch(() => ({
        type: 'UNKNOWN'
      }))
    })

    it('executes function with correct arguments', () => {
      const effect = jest.fn()

      effect.mockImplementation(() => ({
        type: 'UNKNOWN'
      }))

      const store = createStoreWithPlugin()

      store.dispatch(effect)

      expect(effect).toHaveBeenCalledTimes(1)
      expect(effect).toHaveBeenCalledWith(store)
    })

    it('passes though plain actions', () => {
      const reducer = jest.fn()

      reducer.mockImplementation((state, action) => state)

      const store = createStoreWithPlugin(reducer)
      const action = {
        type: 'UNKNOWN'
      }

      store.dispatch(action)

      expect(reducer).toHaveBeenCalledTimes(1)
      expect(reducer.mock.calls[0][1]).toBe(action)
    })

    it('passes to reducer returned actions', () => {
      const reducer = jest.fn()

      reducer.mockImplementation((state, action) => state)

      const store = createStoreWithPlugin(reducer)
      const action = {
        type: 'UNKNOWN'
      }

      store.dispatch(() => action)

      expect(reducer).toHaveBeenCalledTimes(1)
      expect(reducer.mock.calls[0][1]).toBe(action)
    })
  })
})
