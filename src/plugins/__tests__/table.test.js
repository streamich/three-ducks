import {createStore} from '../../'
import pluginDipatch from '../dispatch'
import pluginReducer from '../reducer'
import pluginTable from '../table'

const createStoreWithTable = (reducer = state => state) => {
  return createStore({}, [
    pluginDipatch(),
    pluginReducer(reducer),
    pluginTable()
  ])
}

describe('plugin', () => {
  describe('table', () => {
    it('exists', () => {
      expect(typeof pluginTable).toBe('function')
    })

    it('exposes .createModel() method', () => {
      const store = createStoreWithTable()

      expect(typeof store.createModel).toBe('function')
    })

    it('creates a model with expected interface', () => {
      const store = createStoreWithTable()
      const User = store.createModel({
        name: 'User',
        fields: [
          'id',
          'name'
        ]
      })

      expect(typeof User).toBe('function')

      const user = new User()

      expect(typeof user).toBe('object')
      expect(typeof user.select).toBe('function')
      expect(typeof user.path).toBe('function')
      expect(typeof user.patch).toBe('function')
      expect(typeof user.delete).toBe('function')
    })

    it('updates field', () => {
      const store = createStoreWithTable()
      const User = store.createModel({
        name: 'User',
        fields: [
          'id',
          'name'
        ]
      })

      expect(typeof User).toBe('function')

      const user = new User('123')

      user.name = 'Tester'

      expect(store.state.User.byId['123'].name).toBe('Tester')
    })

    it('model enhancer', () => {
      const store = createStoreWithTable()

      const MyUser = class MyUser {}

      const MyUser_ = store.model({
        name: 'MyUser',
        fields: [
          'id',
          'tags'
        ]
      })(MyUser)

      const user = new MyUser_()

      user.setId('1')
      user.tags = [1, 2, 3]

      expect(store.state.MyUser.byId['1'].tags).toEqual([1, 2, 3])
    })
  })
})
