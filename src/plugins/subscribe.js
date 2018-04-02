const subscribe = () => store => {
  store.subscribe = listener => {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof listener !== 'function') {
        throw new Error('Expected the listener to be a function.')
      }

      if (store.isDispatching) {
        throw new Error(
          'You may not call store.subscribe() while the reducer is executing. ' +
            'If you would like to be notified after the store has been updated, subscribe from a ' +
            'component and invoke store.getState() in the callback to access the latest state. ' +
            'See http://redux.js.org/docs/api/Store.html#subscribe for more details.'
        )
      }
    }

    const wrap = () => listener()

    store.listeners = [...store.listeners, wrap]

    return function unsubscribe () {
      if (process.env.NODE_ENV !== 'production') {
        if (store.isDispatching) {
          throw new Error(
            'You may not unsubscribe from a store listener while the reducer is executing. ' +
              'See http://redux.js.org/docs/api/Store.html#subscribe for more details.'
          )
        }
      }

      store.listeners = store.listeners.filter(l => l !== wrap)
    }
  }
}

export default subscribe
