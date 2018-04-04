export const createStore = (state, plugins) => {
  const store = {state}

  if (process.env.NODE_ENV !== 'production') {
    if (!(plugins instanceof Array)) {
      throw new TypeError('createStore() expects second argument to be a list of plugins.')
    }
  }

  for (const plugin of plugins) plugin(store)

  return store
}
