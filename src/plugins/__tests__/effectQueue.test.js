import {createStore} from '../../'
import pluginDipatch from '../dispatch'
import pluginReducer from '../reducer'
import pluginEffectQueue from '../effectQueue'

const createStoreWithPlugin = (reducer = state => state) => {
  return createStore({}, [
    pluginDipatch(),
    pluginReducer(reducer),
    pluginEffectQueue()
  ])
}

describe('plugin', () => {
  describe('effectQueue', () => {
    it('exists', () => {
      expect(typeof pluginEffectQueue).toBe('function')
    })

    it('does not crash', () => {
      const store = createStoreWithPlugin()

      store.dispatch({
        type: 'UNKNOWN'
      })
    })

    it('installs interfaces', () => {
      const store = createStoreWithPlugin()

      expect(typeof store.withEffect).toBe('function')
      expect(store.effectListeners instanceof Array).toBe(true)
    })

    it('does nothing for simple actions', () => {
      const reducer = jest.fn()

      reducer.mockImplementation((state, action) => ({foo: 'bar'}))

      const store = createStoreWithPlugin(reducer)
      const action = {
        type: 'UNKNOWN'
      }

      store.dispatch(action)

      expect(reducer).toHaveBeenCalledTimes(1)
      expect(reducer.mock.calls[0][1]).toBe(action)
      expect(store.state).toEqual({
        foo: 'bar'
      })
    })

    it('calls effect listener with queued effect', () => {
      const store = createStoreWithPlugin(() => {})
      const reducer = jest.fn()

      store.reducer = reducer

      const effect = {}

      reducer.mockImplementation((state, action) => store.withEffect(
        {foo: 'bar'},
        effect
      ))

      const listener = jest.fn()

      store.effectListeners.push(listener)

      const action = {
        type: 'UNKNOWN'
      }

      store.dispatch(action)

      expect(reducer).toHaveBeenCalledTimes(1)
      expect(reducer.mock.calls[0][1]).toBe(action)
      expect(store.state).toEqual({
        foo: 'bar'
      })

      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith([effect])
    })

    it('queues multiple effects', () => {
      const store = createStoreWithPlugin(() => {})
      const reducer = jest.fn()

      store.reducer = reducer

      const effect1 = {}
      const effect2 = {}

      reducer.mockImplementation((state, action) => {
        store.withEffect(123, effect1)

        return store.withEffect({foo: 'bar'}, effect2)
      })

      const listener = jest.fn()

      store.effectListeners.push(listener)

      const action = {
        type: 'UNKNOWN'
      }

      store.dispatch(action)

      expect(reducer).toHaveBeenCalledTimes(1)
      expect(reducer.mock.calls[0][1]).toBe(action)
      expect(store.state).toEqual({
        foo: 'bar'
      })

      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith([effect1, effect2])
    })
  })
})
