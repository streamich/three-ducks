import {from} from 'rxjs'
import ofType from '../ofType'

describe('ofType', () => {
  it('exists', () => {
    expect(typeof ofType).toBe('function')
  })

  it('filters by type', () => {
    const observable = from([
      {
        type: 'PING'
      },
      {
        type: 'PONG'
      }
    ])
    const arr = []
    observable
      .pipe(ofType('PONG'))
      .subscribe(value => arr.push(value))

    expect(arr).toEqual([ { type: 'PONG' } ])
  })

  it('can provide multiple types in a list', () => {
    const observable = from([
      {
        type: 'PING'
      },
      {
        type: 'PONG'
      },
      {
        type: 'LOL'
      },
      {
        type: 'PONG'
      },
      {
        type: 'GAGA'
      }
    ])
    const arr = []
    observable
      .pipe(ofType('PONG', 'PING'))
      .subscribe(value => arr.push(value))

    expect(arr).toEqual([{'type': 'PING'}, {'type': 'PONG'}, {'type': 'PONG'}])
  })
})
