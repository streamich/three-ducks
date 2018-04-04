import {createStore} from '../../'
import pluginDipatch from '../dispatch'
import pluginReducer from '../reducer'
import pluginEffectQueue from '../effectQueue'
import pluginEffects from '../effects'

const createStoreWithPlugin = (reducer = state => state) => {
  return createStore({}, [
    pluginDipatch(),
    pluginReducer(reducer),
    pluginEffectQueue(),
    pluginEffects()
  ])
}

describe('plugin', () => {
  describe('effects', () => {
    it('exists', () => {
      expect(typeof pluginEffects).toBe('function')
    })

    it('installs expected interfaces', () => {
      const store = createStoreWithPlugin()

      expect(typeof store.effects).toBe('object')
      expect(typeof store.effects.action).toBe('function')
      expect(typeof store.effects.run).toBe('function')
      expect(typeof store.effects.list).toBe('function')
    })

    it('.action() creates ACTION side-effect', () => {
      const {action} = createStoreWithPlugin().effects
      const myAction = () => {}

      expect(action(myAction)).toEqual({
        action: myAction,
        type: 'ACTION'
      })
    })

    it('.run() creates RUN side-effect', () => {
      const {run} = createStoreWithPlugin().effects
      const fn = () => {}
      const a = 1
      const b = 2
      const c = null

      expect(run(fn, a, b, c)).toEqual({
        fn: fn,
        args: [a, b, c],
        type: 'RUN'
      })
    })

    it('.list() creates LIST side-effect', () => {
      const {action, run, list} = createStoreWithPlugin().effects
      const actionInc = () => ({type: 'INCREMENT'})
      const fn = () => {}
      const opts = {
        sequential: true
      }

      const effect = list([
        run(fn, 1, 2, 3, 4),
        action(actionInc())
      ], opts)

      expect(effect).toEqual({
        list: [
          run(fn, 1, 2, 3, 4),
          action(actionInc())
        ],
        opts: opts,
        type: 'LIST'
      })
    })

    it('executes action side-effect', () => {
      const store = createStoreWithPlugin()
      const dispatch = jest.fn()
      const realDispatch = store.dispatch

      dispatch.mockImplementation(realDispatch)
      store.dispatch = dispatch

      const nextAction = () => ({type: 'NEXT_ACTION'})

      store.reducer = (state, action) => {
        if (action.type === 'GO') return store.withEffect({foo: 'bar'}, store.effects.action(nextAction()))
        else return state
      }

      store.dispatch({type: 'GO'})

      expect(dispatch).toHaveBeenCalledTimes(2)
      expect(store.state).toEqual({foo: 'bar'})
      expect(dispatch).toHaveBeenCalledWith({type: 'GO'})
      expect(dispatch).toHaveBeenCalledWith(nextAction())
    })

    describe('run side-effect', () => {
      it('executes run side-effect', () => {
        const store = createStoreWithPlugin()
        const dispatch = jest.fn()
        const realDispatch = store.dispatch

        dispatch.mockImplementation(realDispatch)
        store.dispatch = dispatch

        const fn = jest.fn()

        store.reducer = (state, action) => {
          if (action.type === 'GO') return store.withEffect({foo: 'bar'}, store.effects.run(fn, 1))
          else return state
        }

        store.dispatch({type: 'GO'})

        expect(dispatch).toHaveBeenCalledTimes(1)
        expect(store.state).toEqual({foo: 'bar'})
        expect(dispatch).toHaveBeenCalledWith({type: 'GO'})
        expect(fn).toHaveBeenCalledTimes(1)
        expect(fn).toHaveBeenCalledWith(1)
      })
    })
  })
})
