const createReducer = (store, name, reducers) => {
  const oldReducer = store.reducer
  const reducerMap = {}

  for (const reducerName in reducers) {
    reducerMap[`${name}/${reducerName}`] = reducers[reducerName]
  }

  return (state, action) => {
    const reducer = reducerMap[action.type]

    if (reducer) {
      return reducer(store.state[name], ...action.args)
    }

    return oldReducer(state, action)
  }
}

const plugin = () => (store) => {
  store.rematch = (name, model) => {
    const ctx = {}

    if (model.reducers) {
      for (const prop in model.reducers) {
        ctx[prop] = (...args) => ({
          args,
          type: `${name}/${prop}`
        })
      }

      store.reducer = createReducer(store, name, model.reducers)
    }

    store.dispatch[name] = ctx
  }
}

export default plugin
