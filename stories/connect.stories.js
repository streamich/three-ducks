import React from 'react'
import {storiesOf} from '@storybook/react'
import createStore3DuxRedux from '../src/presets/redux'
// import {createStore} from 'redux'
import {connect, Provider} from 'react-redux'

const reducer = state => state
const store = createStore3DuxRedux(reducer, {
  foo: 'bar 2'
})

const Demo = connect(({foo}) => ({foo}))(({foo}) =>
  <div>foo: {foo}</div>
)

storiesOf('Connect', module)
  .add('default', () =>
    <Provider store={store}>
      <Demo />
    </Provider>
  )
