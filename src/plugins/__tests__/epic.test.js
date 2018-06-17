import {createStore} from '../../'
import pluginDispatch from '../dispatch'
import pluginReducer from '../reducer'
import pluginEpic from '../epic'

const delay = time => new Promise(resolve => setTimeout(resolve, time))

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

    it('works', async () => {
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

      await delay(100)

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
  })
})
