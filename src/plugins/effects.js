const plugin = () => (store) => {
  const executeActionEffect = ({action}) => store.dispatch(action)

  const executeFnEffect = ({fn, args}) => {
    const result = fn(...args)

    return result
  }

  const executeListEffect = ({effects, opts}) => {
    return Promise.all(effects.map((effect) => {

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
    // eslint-disable-next-line
    for (const [state, effect] of effects) { executeEffect(effect) }
  })

  const action = (action) => ({action, type: 'ACTION'})
  const run = (fn, ...args) => ({fn, args, type: 'RUN'})
  const list = (effects, opts) => ({effects, opts, type: 'LIST'})

  store.effects = {
    action,
    run,
    list
  }
}

export default plugin
