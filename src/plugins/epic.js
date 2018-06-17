import {Observable} from 'rxjs/internal/Observable'

const plugin = (epic) => store => {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof epic !== 'function') {
      throw new TypeError('epic must be a function that receives an observable and returns and observable.')
    }
  }

  const observable = Observable.create(observer => {
    const dispatch = store.dispatch
    let live = true

    store.dispatch = (action) => {
      dispatch(action)

      if (live) {
        observer.next(action)
      }
    }

    const unsubscribe = () => {
      live = false
    }

    return {unsubscribe}
  })

  epic(observable, store).subscribe({
    next: (action) => store.dispatch(action)
  })
}

export default plugin
