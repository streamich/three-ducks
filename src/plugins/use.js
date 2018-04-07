const plugin = () => (store) => {
  // Redux middleware has the following signature:
  // (store) => (next) => (action) => result
  store.use = function (middleware) {
    const dispatch = store.dispatch
    const dispatchWithMiddleware = middleware(store)(a => dispatch(a))

    store.dispatch = action => dispatchWithMiddleware(action)

    return store
  }
}

export default plugin
