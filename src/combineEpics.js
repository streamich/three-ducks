import {merge, isObservable} from 'rxjs'

const combineEpics = (...epics) => (...args) => {
  const observables = []

  for (const epic of epics) { observables.push(epic(...args)) }

  if (process.env.NODE_ENV !== 'production') {
    let shouldThrow = false

    for (const obs of observables) {
      if (!isObservable(obs)) {
        shouldThrow = true
      }
    }

    if (shouldThrow) {
      throw new Error('One of the epics does not return an observable.')
    }
  }

  return merge(...observables)
}

export default combineEpics
