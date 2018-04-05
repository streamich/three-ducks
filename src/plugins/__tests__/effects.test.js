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

      expect(action(myAction)).toMatchObject({
        action: myAction,
        type: 'A'
      })
    })

    it('.run() creates RUN side-effect', () => {
      const {run} = createStoreWithPlugin().effects
      const fn = () => {}
      const a = 1
      const b = 2
      const c = null

      expect(run(fn, a, b, c)).toMatchObject({
        fn: fn,
        args: [a, b, c],
        type: 'R'
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

      expect(effect).toMatchObject({
        list: [
          run(fn, 1, 2, 3, 4),
          action(actionInc())
        ],
        opts: opts,
        type: 'L'
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
        if (action.type === 'GO') return store.withEffect({foo: 'bar'}, nextAction())
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

    describe('list side-effect', () => {
      it('executes all actions', () => {
        const store = createStoreWithPlugin()
        const dispatch = jest.fn()
        const realDispatch = store.dispatch

        dispatch.mockImplementation(realDispatch)
        store.dispatch = dispatch

        const {withEffect, run, list} = store.effects

        const fn1 = jest.fn()
        const fn2 = jest.fn()

        store.reducer = (state, action) => {
          if (action.type === 'GO') {
            return withEffect(
              {foo: 'bar'},
              list([
                run(fn1, 1),
                {
                  type: 'SECOND'
                },
                run(fn2, 2)
              ])
            )
          }
          if (action.type === 'SECOND') { return {second: true} } else return state
        }

        store.dispatch({type: 'GO'})

        expect(dispatch).toHaveBeenCalledTimes(2)
        expect(store.state).toEqual({
          second: true
        })
        expect(dispatch).toHaveBeenCalledWith({
          type: 'GO'
        })
        expect(dispatch).toHaveBeenCalledWith({
          type: 'SECOND'
        })
        expect(fn1).toHaveBeenCalledTimes(1)
        expect(fn1).toHaveBeenCalledWith(1)
        expect(fn2).toHaveBeenCalledTimes(1)
        expect(fn2).toHaveBeenCalledWith(2)
      })
    })

    describe('branch() side-effect', () => {
      it('executes success effect', () => {
        const store = createStoreWithPlugin()
        const dispatch = jest.fn()
        const realDispatch = store.dispatch

        dispatch.mockImplementation(realDispatch)
        store.dispatch = dispatch

        const {withEffect, run, branch} = store.effects
        const test = jest.fn()
        const success = jest.fn()
        const failure = jest.fn()

        test.mockImplementation(() => 123)

        store.reducer = (state, action) => {
          return withEffect(
            {foo: 'bar'},
            branch(
              run(test),
              run(success),
              run(failure)
            )
          )
        }

        store.dispatch({
          type: 'SOMETHING'
        })

        expect(store.dispatch).toHaveBeenCalledTimes(1)
        expect(test).toHaveBeenCalledTimes(1)
        expect(success).toHaveBeenCalledTimes(1)
        expect(failure).toHaveBeenCalledTimes(0)
        expect(success).toHaveBeenCalledWith(123)
      })

      it('executes failure effect', () => {
        const store = createStoreWithPlugin()
        const dispatch = jest.fn()
        const realDispatch = store.dispatch

        dispatch.mockImplementation(realDispatch)
        store.dispatch = dispatch

        const {withEffect, run, branch} = store.effects
        const test = jest.fn()
        const success = jest.fn()
        const failure = jest.fn()

        test.mockImplementation(() => {
          // eslint-disable-next-line
          throw 'foobar'
        })

        store.reducer = (state, action) => {
          return withEffect(
            {foo: 'bar'},
            branch(
              run(test),
              run(success),
              run(failure)
            )
          )
        }

        store.dispatch({
          type: 'SOMETHING'
        })

        expect(store.dispatch).toHaveBeenCalledTimes(1)
        expect(test).toHaveBeenCalledTimes(1)
        expect(success).toHaveBeenCalledTimes(0)
        expect(failure).toHaveBeenCalledTimes(1)
        expect(failure).toHaveBeenCalledWith('foobar')
      })

      it('executes async test effect', async () => {
        const store = createStoreWithPlugin()
        const dispatch = jest.fn()
        const realDispatch = store.dispatch

        dispatch.mockImplementation(realDispatch)
        store.dispatch = dispatch

        const {withEffect, run, branch} = store.effects
        const test = jest.fn()
        const success = jest.fn()
        const failure = jest.fn()

        test.mockImplementation(() => Promise.resolve(999))

        store.reducer = (state, action) => {
          return withEffect(
            {foo: 'bar'},
            branch(
              run(test),
              run(success)
            )
          )
        }

        store.dispatch({
          type: 'SOMETHING'
        })

        await Promise.resolve()

        expect(store.dispatch).toHaveBeenCalledTimes(1)
        expect(test).toHaveBeenCalledTimes(1)
        expect(success).toHaveBeenCalledTimes(1)
        expect(failure).toHaveBeenCalledTimes(0)
        expect(success).toHaveBeenCalledWith(999)
      })

      it('executes async test effect and failure effect', async () => {
        const store = createStoreWithPlugin()
        const dispatch = jest.fn()
        const realDispatch = store.dispatch

        dispatch.mockImplementation(realDispatch)
        store.dispatch = dispatch

        const {withEffect, run, branch} = store.effects
        const test = jest.fn()
        const success = jest.fn()
        const failure = jest.fn()

        // eslint-disable-next-line
        test.mockImplementation(() => Promise.reject(-1))

        store.reducer = (state, action) => {
          return withEffect(
            {foo: 'bar'},
            branch(
              run(test),
              null,
              run(failure)
            )
          )
        }

        store.dispatch({
          type: 'SOMETHING'
        })

        await Promise.resolve()

        expect(store.dispatch).toHaveBeenCalledTimes(1)
        expect(test).toHaveBeenCalledTimes(1)
        expect(success).toHaveBeenCalledTimes(0)
        expect(failure).toHaveBeenCalledTimes(1)
        expect(failure).toHaveBeenCalledWith(-1)
      })
    })
  })
})
