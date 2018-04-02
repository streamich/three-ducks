import createStore3DucksRedux from '../src/presets/redux'
import {createStore as createStoreRedux} from 'redux'
import Benchmark from 'benchmark'

export function runBenchmark () {
  const suite = new Benchmark.Suite()

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

  const run = (createStore) => {
    const store = createStore(reducer, {
      cnt: 0
    })

    for (let i = 0; i < 1000; i++) {
      store.dispatch(increment(i))
      store.dispatch(decrement(1))
    }
  }

  suite
    .add('three-ducks (with redux preset)', function () {
      run(createStore3DucksRedux)
    })
    .add('redux', function () {
      run(createStoreRedux)
    })
    .on('cycle', function (event) {
      console.log(String(event.target))
    })
    .on('complete', function () {
      console.log('Fastest is ' + this.filter('fastest').map('name'))
    })
    .run()
}
