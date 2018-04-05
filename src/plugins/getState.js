const plugin = () => store => {
  store.getState = () => {
    if (process.env.NODE_ENV !== 'production') {
      if (store.isDispatching) {
        throw new Error(
          'You may not call store.getState() while the reducer is executing. ' +
            'The reducer has already received the state as an argument. ' +
            'Pass it down from the top reducer instead of reading it from the store.'
        )
      }
    }

    return store.state
  }
}

export default plugin
