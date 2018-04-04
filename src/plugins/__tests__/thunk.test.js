import {createStore} from '../../'
import pluginDipatch from '../dispatch'
import pluginReducer from '../reducer'
import pluginThunk from '../thunk'

const createStoreWithPlugin = (reducer = state => state) => {
  return createStore({}, [
    pluginDipatch(),
    pluginReducer(reducer),
    pluginThunk()
  ])
}

describe('plugin', () => {
  describe('thunk', () => {
    it('exists', () => {
      expect(typeof pluginThunk).toBe('function')
    })

    it('does not crash', () => {
      createStoreWithPlugin()
    })

    it('can pass a function as an action', () => {
      createStoreWithPlugin()
    })
  })
})
