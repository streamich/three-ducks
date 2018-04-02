const PATH_PATCH = '@@PATH_PATCH'
const PATH_DELETE = '@@PATH_DELETE'

const pathPatch = (path, patch) => ({
  path,
  patch,
  type: PATH_PATCH
})

const pathDelete = (path) => ({
  path,
  type: PATH_DELETE
})

const reducerPathPatch = (state, {path, patch}) => {
  if (!path.length) return {...state, ...patch}
  else {
    const [step, ...restPath] = path
    // if (step === void 0) return state;
    return {
      ...state,
      [step]: reducerPathPatch(state[step] || {}, {path: restPath, patch})
    }
  }
}

const reducerPathDelete = (state, {path}) => {
  if (path.length === 1) {
    const [step] = path
    const {[step]: omit, ...newState} = state
    return newState
  } else {
    const [step, ...restPath] = path
    return {
      ...state,
      [step]: reducerPathDelete(state[step] || {}, {path: restPath})
    }
  }
}

export function reducer (state, action) {
  switch (action.type) {
    case PATH_PATCH:
      return reducerPathPatch(state, action)
    case PATH_DELETE:
      return reducerPathDelete(state, action)
    default:
      return state
  }
}

const plugin = (tables) => (store) => {
  const dispatchPatch = (path, patch) =>
    store.dispatch(pathPatch(path, patch))

  function createTable ({name, idField = 'id', fields}) {
    const Model = class {
      path () {
        return [name, 'byId', this.id]
      }

      patch (patch) {
        dispatchPatch(this.path(), patch)
      }

      delete () {
        store.dispatch(pathDelete(this.path()))
      }
    }

    Model.displayName = name

    return Model
  }

  tables.forEach(createTable)
}

export default plugin
