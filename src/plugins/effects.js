const plugin = () => (store) => {
  const executeActionEffect = ({action}) => store.dispatch(action)

  const executeFnEffect = ({fn, args}) => {
    const result = fn(...args)

    return result
  }

  const executeListEffect = ({list, opts}) => {
    return Promise.all(list.map((effect) => {

    }))
  }

  const executeEffect = (effect) => {
    switch (effect.type) {
      case 'ACTION':
        return executeActionEffect(effect)
      case 'RUN':
        return executeFnEffect(effect)
      case 'LIST':
        return executeListEffect(effect)
    }
  }

  store.effectListeners.push((effects) => {
    for (const effect of effects) { executeEffect(effect) }
  })

  const action = (action) => ({action, type: 'ACTION'})
  const run = (fn, ...args) => ({fn, args, type: 'RUN'})
  const list = (list, opts) => ({list, opts, type: 'LIST'})

  store.effects = {
    action,
    run,
    list
  }
}

export default plugin
