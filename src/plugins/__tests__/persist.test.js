import {createStore} from '../../'
import pluginDipatch from '../dispatch'
import pluginReducer from '../reducer'
import pluginPersist from '../persist'

const createStoreWithPlugins = (reducer = state => state) => {
  return createStore({}, [
    pluginDipatch(),
    pluginReducer(reducer)
  ])
}

describe('plugin', () => {
  describe('persist', () => {
    it('adds .save() and .load() methods', () => {
      const store = createStoreWithPlugins()

      pluginPersist()(store)

      expect(typeof store.save).toBe('function')
      expect(typeof store.load).toBe('function')
      expect(typeof store.clean).toBe('function')
    })

    it('saves and reloads state', () => {
      const store = createStoreWithPlugins()

      pluginPersist()(store)

      const state = {
        foo: 'bar',
        users: {
          'adsf-asdfasdf': {
            id: 123,
            name: 'Test user'
          }
        }
      }

      store.state = state
      store.save()
      store.state = {}

      expect(store.state).not.toEqual(state)

      store.load()

      expect(store.state).toEqual(state)
    })
  })
})
