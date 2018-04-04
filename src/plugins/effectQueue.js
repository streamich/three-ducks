const plugin = () => (store) => {
  const dispatch = store.dispatch
  let effectQueue

  store.effectListeners = []

  store.effect = (state, effect) => {
    effectQueue.push([state, effect])
    return state
  }

  store.dispatch = function () {
    effectQueue = []

    const result = dispatch.apply(this, arguments)

    for (const listener of store.effectListeners) { listener(effectQueue) }

    return result
  }
}

export default plugin
