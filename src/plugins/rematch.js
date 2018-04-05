const INIT = '@@rematch/INIT'

const createReducer = (store, {name, reducers, state: initialState}) => {
  const oldReducer = store.reducer
  const reducerMap = {}

  for (const reducerName in reducers) {
    reducerMap[`${name}/${reducerName}`] = reducers[reducerName]
  }

  return (state, action) => {
    if (action.type === INIT) {
      return {
        ...state,
        [name]: initialState
      }
    }

    const reducer = reducerMap[action.type]

    if (reducer) {
      return {
        ...state,
        [name]: reducer(state[name], ...action.args)
      }
    }

    return oldReducer(state, action)
  }
}

const plugin = () => (store) => {
  store.rematch = (model, name) => {
    if (!model.name) {
      model.name = name
    }

    name = model.name

    const ctx = {}

    if (model.reducers) {
      for (const prop in model.reducers) {
        ctx[prop] = (...args) => store.dispatch({
          args,
          type: `${name}/${prop}`
        })
      }

      store.reducer = createReducer(store, model)
      store.dispatch({
        type: INIT
      })
    }

    store.dispatch[name] = ctx
  }
}

export default plugin
