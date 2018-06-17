import {merge} from 'rxjs'

const combineEpics = (...epics) => (...args) => {
  const observables = []

  for (const epic of epics) { observables.push(epic(...args)) }

  return merge(...observables)
}

export default combineEpics
