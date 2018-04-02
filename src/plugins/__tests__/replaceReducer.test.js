import {createStore} from '../../'
import pluginReplaceReducer from '../replaceReducer'

describe('plugin', () => {
  describe('.pluginReplaceReducer()', () => {
    it('add .pluginReplaceReducer() method', () => {
      const store = createStore({}, [pluginReplaceReducer()])

      expect(typeof store.replaceReducer).toBe('function')
    })

    it('sets new reducer', () => {
      const reducer = () => {}
      const store = createStore({}, [pluginReplaceReducer()])

      expect(store.reducer).not.toBe(reducer)

      store.replaceReducer(reducer)

      expect(store.reducer).toBe(reducer)
    })
  })
})
