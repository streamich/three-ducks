import {createStore} from '../../'
import pluginDipatch from '../dispatch'
import pluginReducer from '../reducer'
import pluginDispatchInit from '../dispatchInit'

const createStoreWithPlugin = (reducer = state => state, event) => {
  return createStore({}, [
    pluginDipatch(),
    pluginReducer(reducer),
    pluginDispatchInit(event)
  ])
}

describe('plugin', () => {
  describe('dispatchInit', () => {
    it('exists', () => {
      expect(typeof pluginDispatchInit).toBe('function')
    })

    it('dispatches init action', () => {
      const reducer = jest.fn()
      createStoreWithPlugin(reducer)

      expect(reducer).toHaveBeenCalledTimes(1)
      expect(reducer.mock.calls[0][1]).toEqual({
        type: '@@INIT-1.2.3'
      })
    })

    it('can specify custom evnet type', () => {
      const reducer = jest.fn()
      createStoreWithPlugin(reducer, 'foobar')

      expect(reducer).toHaveBeenCalledTimes(1)
      expect(reducer.mock.calls[0][1]).toEqual({
        type: 'foobar'
      })
    })
  })
})
