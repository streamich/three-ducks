const $$effect = '@@effect'

const createEffect = (obj) => {
  obj[$$effect] = 1

  return obj
}

const isPromise = (a) => (typeof a === 'object') && (typeof a.then === 'function')

const plugin = () => (store) => {
  const executeActionEffect = ({action}) => store.dispatch(action)

  const executeFnEffect = ({fn, args}, ...moreArgs) => {
    return fn.apply(null, (args || []).concat(moreArgs))
  }

  const executeListEffect = ({list, opts}) => {
    for (const effect of list) { executeEffect(effect) }
  }

  const executeBranchEffect = async ({test, success, failure}, ...args) => {
    try {
      const result = executeEffect(test, ...args)

      if (isPromise(result)) {
        const promiseResult = await result

        if (success) {
          return executeEffect(success, promiseResult)
        }
      } else {
        if (success) {
          return executeEffect(success, result)
        }
      }
    } catch (error) {
      if (failure) {
        return executeEffect(failure, error)
      }
    }
  }

  const effectMap = {
    A: executeActionEffect,
    R: executeFnEffect,
    L: executeListEffect,
    B: executeBranchEffect
  }

  const executeEffect = (effect, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof effect !== 'object') {
        throw new TypeError('Effect must be either effect object or action object.')
      }
    }

    if (effect[$$effect]) {
      return effectMap[effect.type](effect, ...args)
    } else {
      return store.dispatch(effect)
    }
  }

  store.effectListeners.push((effects) => {
    for (const effect of effects) { executeEffect(effect) }
  })

  const action = (action) => createEffect({
    action,
    type: 'A'
  })

  const run = (fn, ...args) => createEffect({
    fn,
    args,
    type: 'R'
  })

  const list = (list, opts) => {
    if (process.env.NODE_EVN !== 'production') {
      if (!Array.isArray(list)) {
        throw new TypeError('list() effect creator expects first argument to be a list of effects.')
      }
    }

    return createEffect({
      list,
      opts,
      type: 'L'
    })
  }

  const branch = (test, success, failure) => createEffect({
    test,
    success,
    failure,
    type: 'B'
  })

  store.effects = {
    withEffect: store.withEffect,
    action,
    run,
    list,
    branch
  }
}

export default plugin
