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

const crateReducer = (reducer) => (state, action) => {
  switch (action.type) {
    case PATH_PATCH:
      return reducerPathPatch(state, action)
    case PATH_DELETE:
      return reducerPathDelete(state, action)
    default:
      return reducer(state, action)
  }
}

const selectPath = (state, path) => {
  let curr = state
  for (let i = 0; i < path.length; i++) {
    if (!curr || typeof curr !== 'object') return void 0
    curr = curr[path[i]]
  }
  return curr
}

const plugin = () => (store) => {
  const dispatchPatch = (path, patch) =>
    store.dispatch(pathPatch(path, patch))

  store.reducer = crateReducer(store.reducer)

  store.link = (path, fields, obj) => {
    for (const field of fields) {
      Object.defineProperty(obj, field, {
        enumerable: true,
        get: function () {
          return this.select()[field]
        },
        set: function (value) {
          this.patch({[field]: value})
        }
      })
    }
  }

  store.enhanceModel = (Model, {name, idField = 'id', fields, path}) => {
    Model.displayName = name
    store[name] = Model

    Model.prototype.path = function () {
      return path ? path(this) : [name, 'byId', this.id]
    }

    Model.prototype.select = function () {
      return selectPath(store.state, this.path()) || {}
    }

    Model.prototype.patch = function (patch) {
      dispatchPatch(this.path(), patch)
    }

    Model.prototype.delete = function () {
      store.dispatch(pathDelete(this.path()))
    }

    Object.defineProperty(Model.prototype, idField, {
      enumerable: true,
      get: function () {
        return this.__id
      },
      set: function (id) {
        this.__id = id
        this.patch({[idField]: id})
      }
    })

    return Model
  }

  store.createModel = (schema) =>
    store.enhanceModel(class {}, schema)

  // Class decorator
  store.model = (schema) => (Model) =>
    store.enhanceModel(Model, schema)
}

export default plugin
