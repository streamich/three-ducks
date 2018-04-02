import {createStore} from '../../'
import pluginActions from '../actions'

describe('plugin', () => {
  describe('actions', () => {
    it('adds .actions object', () => {
      const store = createStore({}, [pluginActions()])

      expect(store.actions).toEqual({})
    })
  })
})
