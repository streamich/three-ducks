import {createStore} from '../../'
import pluginDispatch from '../dispatch'
import pluginReducer from '../reducer'
import pluginSubscribe from '../subscribe'

describe('plugin', () => {
  describe('.subscribe()', () => {
    it('adds .subscribe() method', () => {
      const store = createStore({}, [
        pluginSubscribe()
      ])

      expect(typeof store.subscribe).toBe('function')
    })

    it('listener called when state changes', () => {
      const oldState = {}
      const newState = {}
      const reducer = () => newState
      const store = createStore(oldState, [
        pluginDispatch(),
        pluginReducer(reducer),
        pluginSubscribe()
      ])

      const listener = jest.fn()

      store.subscribe(listener)

      const action = {}

      expect(listener).toHaveBeenCalledTimes(0)
      store.dispatch(action)
      expect(listener).toHaveBeenCalledTimes(1)
      store.dispatch(action)
      expect(listener).toHaveBeenCalledTimes(1)
      store.dispatch(action)
      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('listener not called when unsubscribed', () => {
      const oldState = {}
      const newState = {}
      const reducer = () => newState
      const store = createStore(oldState, [
        pluginDispatch(),
        pluginReducer(reducer),
        pluginSubscribe()
      ])

      const listener1 = jest.fn()
      const listener2 = jest.fn()

      const unsubscribe1 = store.subscribe(listener1)
      store.subscribe(listener2)

      const action = {}

      unsubscribe1()

      expect(listener1).toHaveBeenCalledTimes(0)
      expect(listener2).toHaveBeenCalledTimes(0)
      store.dispatch(action)
      expect(listener1).toHaveBeenCalledTimes(0)
      expect(listener2).toHaveBeenCalledTimes(1)
      store.dispatch(action)
      expect(listener1).toHaveBeenCalledTimes(0)
      expect(listener2).toHaveBeenCalledTimes(1)
    })
  })
})
