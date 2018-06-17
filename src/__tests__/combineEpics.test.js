import {from, empty} from 'rxjs'
import {map, filter} from 'rxjs/operators'
import combineEpics from '../combineEpics'

process.env.NODE_ENV = 'development'

describe('combineEpics', () => {
  it('exists', () => {
    expect(typeof combineEpics).toBe('function')
  })

  it('throws if epic does not return observable', () => {
    expect(() => {
      combineEpics(() => undefined)(empty())
    }).toThrow()

    combineEpics(() => empty())(empty())
  })

  it('works', () => {
    const epic1 = (action$) =>
      action$.pipe(
        filter(({type}) => type === 'PING'),
        map(() => ({type: 'PONG'}))
      )
    const epic2 = (action$) =>
      action$.pipe(
        map(() => ({type: 'ALWAYS'}))
      )

    const log = []

    const action$ = from([
      {
        type: 'PING'
      },
      {
        type: 'LOL'
      }
    ])

    const epic = combineEpics(epic1, epic2)

    epic(action$).subscribe({
      next: (value) => log.push(value)
    })

    expect(log).toEqual([ { type: 'PONG' }, { type: 'ALWAYS' }, { type: 'ALWAYS' } ])
  })
})
