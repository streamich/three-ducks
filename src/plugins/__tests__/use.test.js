import {createStore} from '../../'
import pluginDipatch from '../dispatch'
import pluginReducer from '../reducer'
import pluginUse from '../use'

const createStoreWithPlugins = (reducer = state => state) => {
  return createStore({}, [
    pluginDipatch(),
    pluginReducer(reducer),
    pluginUse()
  ])
}

describe('plugin', () => {
  describe('use', () => {
    it('exists', () => {
      expect(typeof pluginUse).toBe('function')
    })

    it('installs .use() method', () => {
      const store = createStoreWithPlugins()

      expect(typeof store.use).toBe('function')
    })

    it('can add logger middleware', () => {
      const log = jest.fn()
      const logger = (store) => (next) => (action) => {
        log(store.state) // old state
        next(action)
        log(store.state) // new state
      }
      const reducer = () => ({foo: 'bar'})
      const store = createStoreWithPlugins(reducer)

      const returnForChaining = store.use(logger)

      expect(returnForChaining).toBe(store)

      store.dispatch({
        type: 'SOMETHING'
      })

      expect(log).toHaveBeenCalledTimes(2)
      expect(log.mock.calls[0][0]).toEqual({})
      expect(log.mock.calls[1][0]).toEqual({foo: 'bar'})
    })
  })
})
