const plugin = () => store => {
  store.replaceReducer = nextReducer => {
    if (process.env.NODE_ENV !== 'producrtion') {
      if (typeof nextReducer !== 'function') {
        throw new Error('Expected the nextReducer to be a function.')
      }
    }

    store.reducer = nextReducer
  }
}

export default plugin
