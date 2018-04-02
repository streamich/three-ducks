import React, {Component} from 'react'
import {storiesOf} from '@storybook/react'
import {runBenchmark} from '../benchmark'

class Benchmark extends Component {
  componentDidMount () {
    setTimeout(() => {
      runBenchmark()
    })
  }

  render () {
    return <div>Open console to see benchmark results. (NODE_ENV: {process.env.NODE_ENV})</div>
  }
}

storiesOf('Benchmark', module)
  .add('default', () =>
    <Benchmark />
  )
