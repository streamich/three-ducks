import {createStore} from '../../'
import pluginDipatch from '../dispatch'
import pluginReducer from '../reducer'

const action = {
  type: 'UNKNOWN'
}

describe('plugin', () => {
  describe('reducer', () => {
    it('sets default reducer', () => {
      const reducer = jest.fn()
      const store = createStore({}, [
        pluginDipatch(),
        pluginReducer(reducer)
      ])

      expect(store.reducer).toBe(reducer)
    })

    it('adds empty listener list', () => {
      const reducer = jest.fn()
      const store = createStore({}, [
        pluginDipatch(),
        pluginReducer(reducer)
      ])

      expect(store.listeners).toEqual([])
    })

    it('adds reducer middleware', () => {
      const reducer = jest.fn()
      const store = createStore({}, [
        pluginDipatch(),
        pluginReducer(reducer)
      ])

      expect(store.middlewares.length).toBe(1)
    })

    it('calls reducer with action and store', () => {
      const reducer = jest.fn()
      const store = createStore({}, [
        pluginDipatch(),
        pluginReducer(reducer)
      ])
      const state = store.state

      store.dispatch(action)

      expect(reducer).toHaveBeenCalledTimes(1)
      expect(reducer).toHaveBeenCalledWith(state, action)
    })

    it('calls listeners with store and old state, if state changes', () => {
      const oldState = {}
      const newState = {}
      const reducer = () => newState
      const store = createStore(oldState, [
        pluginDipatch(),
        pluginReducer(reducer)
      ])
      store.listeners = [
        jest.fn(),
        jest.fn(),
        jest.fn()
      ]

      store.dispatch(action)

      for (const listener of store.listeners) {
        expect(listener).toHaveBeenCalledTimes(1)
        expect(listener).toHaveBeenCalledWith(store, oldState)
      }
    })
  })
})
