const dispatch = () => store => {
  store.middlewares = []
  store.dispatch = action => {
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

      if (store.isDispatching) {
        throw new Error('Reducers may not dispatch actions.')
      }
    }

    let result

    for (const middleware of store.middlewares) {
      result = middleware(action, store)

      if (result !== undefined) return result
    }
  }
}

export default dispatch
