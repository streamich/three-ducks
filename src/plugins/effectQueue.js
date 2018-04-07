const plugin = () => (store) => {
  store.effectListeners = []

  let effectQueue = []

  const dispatchEffect = (effect) => {
    effectQueue.push(effect)
  }

  store.effect = dispatchEffect
  store.withEffect = (state, effect) => {
    dispatchEffect(effect)

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
