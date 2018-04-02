const plugin = reducer => store => {
  if (process.env.NODE_ENV !== 'production') {
    store.isDispatching = false

    if (typeof reducer !== 'function') {
      throw new TypeError('reducer must be a function')
    }
  }

  store.reducer = reducer
  store.listeners = []
  store.middlewares.push((action, store) => {
    if (!action) return

    const oldState = store.state

    if (process.env.NODE_ENV === 'production') {
      store.state = store.reducer(oldState, action)
    } else {
      try {
        store.isDispatching = true
        store.state = store.reducer(oldState, action)
      } finally {
        store.isDispatching = false
      }
    }

    const {listeners} = store

    for (const listener of listeners) listener(store, oldState)
  })
}

export default plugin
