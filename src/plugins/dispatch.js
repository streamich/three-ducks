const plugin = () => store => {
  store.middlewares = []
  store.dispatch = action => {
    if (process.env.NODE_ENV !== 'production') {
      if (store.isDispatching) {
        throw new Error('Reducers may not dispatch actions.')
      }
    }

    let result

    for (const middleware of store.middlewares) {
      result = middleware(action, store)

      if (result !== undefined) {
        if (result) {
          action = result
        } else {
          return result
        }
      }
    }
  }
}

export default plugin
