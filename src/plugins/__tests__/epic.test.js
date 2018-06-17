import {from} from 'rxjs'
import {filter, map} from 'rxjs/operators'
import {createStore} from '../../'
import pluginDispatch from '../dispatch'
import pluginReducer from '../reducer'
import pluginEpic from '../epic'
import combineEpics from '../../combineEpics'

const createStoreWithPlugin = (epic, reducer = state => state) => {
  return createStore({}, [
    pluginDispatch(),
    pluginReducer(reducer),
    pluginEpic(epic)
  ])
}

describe('plugin', () => {
  describe('epics', () => {
    it('is a function', () => {
      expect(typeof pluginEpic).toBe('function')
    })

    it('throws if epic is not a function', () => {
      expect(() => {
        createStore(123)
      }).toThrow()
    })

    it('works', () => {
      const log = []
      const epic = (observable, store) => {
        return {
          subscribe (sink) {
            observable.subscribe({
              next: action => {
                if (action.type === 'PING') {
                  sink.next({type: 'PONG'})
                }
              }
            })
          }
        }
      }
      const store = createStoreWithPlugin(epic)
      const dispatch = store.dispatch

      store.dispatch = (action) => {
        log.push(action)
        dispatch(action)
      }

      store.dispatch({
        type: 'PING'
      })

      store.dispatch({
        type: 'NOT_PING'
      })

      expect(log).toEqual([
        { type: 'PING' },
        { type: 'PONG' },
        { type: 'NOT_PING' }
      ])
    })

    it('works with rxjs', () => {
      const log = []
      const epic = (observable, store) =>
        from(observable).pipe(
          filter(({type}) => type === 'PING'),
          map(() => ({type: 'PONG'}))
        )
      const store = createStoreWithPlugin(epic)
      const dispatch = store.dispatch

      store.dispatch = (action) => {
        log.push(action)
        dispatch(action)
      }

      store.dispatch({
        type: 'PING'
      })

      store.dispatch({
        type: 'NOT_PING'
      })

      expect(log).toEqual([
        { type: 'PING' },
        { type: 'PONG' },
        { type: 'NOT_PING' }
      ])
    })

    describe('combineEpics', () => {
      it('works', () => {
        const log = []
        const epic1 = (observable, store) =>
          from(observable).pipe(
            filter(({type}) => type === 'PING'),
            map(() => ({type: 'PONG1'}))
          )
        const epic2 = (observable, store) =>
          from(observable).pipe(
            filter(({type}) => type === 'PING'),
            map(() => ({type: 'PONG2'}))
          )
        const store = createStoreWithPlugin(combineEpics(epic1, epic2))
        const dispatch = store.dispatch

        store.dispatch = (action) => {
          log.push(action)
          dispatch(action)
        }

        store.dispatch({
          type: 'PING'
        })

        store.dispatch({
          type: 'NOT_PING'
        })

        expect(log).toEqual([{'type': 'PING'}, {'type': 'PONG1'}, {'type': 'PONG2'}, {'type': 'NOT_PING'}])
      })
    })
  })
})
