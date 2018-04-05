const plugin = () => (store) => {
  store.effectListeners = []

  let effectQueue = []

  store.withEffect = (state, effect) => {
    effectQueue.push(effect)

    return state
  }

  const dispatch = store.dispatch

  store.dispatch = function () {
    effectQueue = []

    const result = dispatch.apply(this, arguments)

    for (const listener of store.effectListeners) { listener(effectQueue) }

    return result
  }
}

export default plugin
