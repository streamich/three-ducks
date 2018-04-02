const dispatch = () => store => {
  store.middlewares = []
  store.dispatch = action => {
    let result

    for (const middleware of store.middlewares) {
      result = middleware(action, store)

      if (result !== undefined) return result
    }
  }
}

export default dispatch
