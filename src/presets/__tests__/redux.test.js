import createReduxStore from '../redux'

describe('presets', () => {
  describe('redux', () => {
    it('exists', () => {
      expect(typeof createReduxStore).toBe('function')
    })

    it('returns a store object with Redux API', () => {
      const reducer = () => {}
      const store = createReduxStore(reducer)

      expect(typeof store).toBe('object')
      expect(typeof store.getState).toBe('function')
      expect(typeof store.dispatch).toBe('function')
      expect(typeof store.subscribe).toBe('function')
      expect(typeof store.replaceReducer).toBe('function')
    })
  })
})
