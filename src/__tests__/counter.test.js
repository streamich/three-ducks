import createReduxStore from '../presets/redux'

describe('counter', () => {
  it('using Redux preset', () => {
    const increment = (value) => ({
      value,
      type: 'INCREMENT'
    })

    const decrement = (value) => ({
      value,
      type: 'DECREMENT'
    })

    const reducer = (state, action) => {
      switch (action.type) {
        case 'INCREMENT':
          return {...state, cnt: state.cnt + action.value}
        case 'DECREMENT':
          return {...state, cnt: state.cnt - action.value}
        default:
          return state
      }
    }

    const store = createReduxStore(reducer, {cnt: 5})

    expect(store.getState()).toEqual({cnt: 5})
    store.dispatch(increment(1))
    expect(store.getState()).toEqual({cnt: 6})
    store.dispatch(increment(5))
    expect(store.getState()).toEqual({cnt: 11})
    store.dispatch(decrement(-1))
    expect(store.getState()).toEqual({cnt: 12})
    store.dispatch({
      type: 'UNKNOWN'
    })
    expect(store.getState()).toEqual({cnt: 12})
  })
})
