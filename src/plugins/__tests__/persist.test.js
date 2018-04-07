import {createStore} from '../../'
import pluginDipatch from '../dispatch'
import pluginReducer from '../reducer'
import pluginPersist from '../persist'

const createDriver = () => ({
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn()
})

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

    it('save store using driver', () => {
      const store = createStoreWithPlugins()
      const driver = createDriver()

      pluginPersist({driver})(store)

      store.state = {
        foo: 'bar'
      }
      store.save()

      expect(driver.set).toHaveBeenCalledTimes(1)
      expect(driver.get).toHaveBeenCalledTimes(0)
      expect(driver.delete).toHaveBeenCalledTimes(0)

      expect(driver.set).toHaveBeenCalledWith(JSON.stringify({foo: 'bar'}))
    })

    it('saves and reloads state', async () => {
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

      await store.load()

      expect(store.state).toEqual(state)
    })

    it('load store using driver', async () => {
      const store = createStoreWithPlugins()
      const driver = createDriver()

      driver.get.mockImplementation(async () => JSON.stringify({
        hello: 'world'
      }))

      pluginPersist({driver})(store)

      expect(store.state).not.toEqual({
        hello: 'world'
      })

      await store.load()

      expect(store.state).toEqual({
        hello: 'world'
      })
    })

    it('.clean() calls driver .delete() method', async () => {
      const store = createStoreWithPlugins()
      const driver = createDriver()

      pluginPersist({driver})(store)

      expect(driver.delete).toHaveBeenCalledTimes(0)

      store.clean()

      expect(driver.delete).toHaveBeenCalledTimes(1)
      expect(driver.delete).toHaveBeenCalledWith()
    })
  })
})
