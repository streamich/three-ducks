import {createStore} from '../../'
import pluginDispatch from '../dispatch'

describe('plugin', () => {
  describe('dispatch', () => {
    it('adds .dipatch() method', () => {
      const store = createStore({}, [pluginDispatch()])

      expect(typeof store.dispatch).toBe('function')
    })

    it('adds .middlewares list', () => {
      const store = createStore({}, [pluginDispatch()])

      expect(store.middlewares).toEqual([])
    })

    it('calls to dispatch does not crash', () => {
      const store = createStore({}, [pluginDispatch()])

      store.dispatch()
    })

    it('calls middlewares with dispatched action and store', () => {
      const store = createStore({}, [pluginDispatch()])

      store.middlewares = [
        jest.fn(),
        jest.fn(),
        jest.fn()
      ]

      const action = {}

      store.dispatch(action)

      for (const middleware of store.middlewares) {
        expect(middleware).toHaveBeenCalledTimes(1)
        expect(middleware).toHaveBeenCalledWith(action, store)
      }
    })

    it('stops middleware chain if middleware returns non-undefined', () => {
      const store = createStore({}, [pluginDispatch()])

      store.middlewares = [
        jest.fn(),
        jest.fn(),
        jest.fn()
      ]

      store.middlewares[1].mockImplementation(() => false)

      const action = {}

      store.dispatch(action)

      expect(store.middlewares[0]).toHaveBeenCalledTimes(1)
      expect(store.middlewares[0]).toHaveBeenCalledWith(action, store)

      expect(store.middlewares[1]).toHaveBeenCalledTimes(1)
      expect(store.middlewares[1]).toHaveBeenCalledWith(action, store)

      expect(store.middlewares[2]).toHaveBeenCalledTimes(0)
    })
  })
})
