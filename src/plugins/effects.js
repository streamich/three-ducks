const plugin = () => (store) => {
  const executeActionEffect = ({action}) => store.dispatch(action)

  const executeFnEffect = ({fn, args}, ...moreArgs) => {
    fn.apply(null, (args || []).concat(moreArgs))
  }

  const executeListEffect = ({list, opts}) => {
    for (const effect of list) { executeEffect(effect) }
  }

  const executeBranchEffect = async ({test, success, failure}) => {
    try {
      const result = await executeEffect(test)

      if (success) {
        return executeEffect(success, result)
      }
    } catch (error) {
      if (failure) {
        return executeEffect(failure, error)
      }
    }
  }

  const executeEffect = (effect, ...args) => {
    switch (effect.type) {
      case 'ACTION':
        return executeActionEffect(effect, ...args)
      case 'RUN':
        return executeFnEffect(effect, ...args)
      case 'BRANCH':
        return executeBranchEffect(effect, ...args)
      case 'LIST':
        return executeListEffect(effect, ...args)
    }
  }

  store.effectListeners.push((effects) => {
    for (const effect of effects) { executeEffect(effect) }
  })

  const action = (action) => ({action, type: 'ACTION'})
  const run = (fn, ...args) => ({fn, args, type: 'RUN'})
  const list = (list, opts) => ({list, opts, type: 'LIST'})
  const branch = (test, success, failure) => ({
    test,
    success,
    failure,
    type: 'BRANCH'
  })

  store.effects = {
    action,
    run,
    list,
    branch
  }
}

export default plugin
