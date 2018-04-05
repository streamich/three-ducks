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
    if (process.env.NODE_ENV !== 'production') {
      /* eslint-disable */
      function isPlainObject (obj) {
        if (typeof obj !== 'object' || obj === null) return false

        let proto = obj
        while (Object.getPrototypeOf(proto) !== null) {
          proto = Object.getPrototypeOf(proto)
        }

        return Object.getPrototypeOf(obj) === proto
      }
      /* eslint-enable */

      if (!isPlainObject(action)) {
        throw new Error(
          'Actions must be plain objects. ' +
            'Use custom middleware for async actions.'
        )
      }

      if (typeof action.type === 'undefined') {
        throw new Error(
          'Actions may not have an undefined "type" property. ' +
            'Have you misspelled a constant?'
        )
      }
    }

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
