import {createStore} from '../../'
import pluginGetState from '../getState'

describe('plugin', () => {
  describe('.getState()', () => {
    it('add .getState() method', () => {
      const store = createStore({}, [pluginGetState()])

      expect(typeof store.getState).toBe('function')
    })

    it('returns state', () => {
      const state = {}
      const store = createStore(state, [pluginGetState()])

      expect(store.getState()).toBe(state)
    })
  })
})
