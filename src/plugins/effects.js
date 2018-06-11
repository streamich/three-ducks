import effectQueuePlugin from './effectQueue'

const $$effect = '@@effect'

const createEffect = (obj) => {
  obj[$$effect] = 1

  return obj
}

const isPromise = (a) => (typeof a === 'object') && (typeof a.then === 'function')

const plugin = () => (store) => {
  if (!store.withEffect) {
    effectQueuePlugin(store)
  }

  const executeActionEffect = ({action}) => store.dispatch(action)

  const executeFnEffect = ({fn, args}, ...moreArgs) => {
    return fn.apply(null, (args || []).concat(moreArgs))
  }

  const executeListEffect = ({list, opts}) => {
    for (const effect of list) { execEffect(effect) }
  }

  const executeBranchEffect = ({test, success, failure}, ...args) => {
    try {
      const result = execEffect(test, ...args)

      if (isPromise(result)) {
        return result.then(promiseResult => {
          return success
            ? execEffect(success, promiseResult)
            : promiseResult
        }, error => failure ? execEffect(failure, error) : error)
      } else {
        if (success) {
          return execEffect(success, result)
        }
      }
    } catch (error) {
      if (failure) {
        return execEffect(failure, error)
      }
    }
  }

  const effectMap = store.effectMap = {
    A: executeActionEffect,
    R: executeFnEffect,
    L: executeListEffect,
    B: executeBranchEffect
  }

  const execEffect = store.execEffect = (effect, ...args) => {
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
    for (const effect of effects) { execEffect(effect) }
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
    createEffect,
    action,
    run,
    list,
    branch
  }
}

export default plugin
