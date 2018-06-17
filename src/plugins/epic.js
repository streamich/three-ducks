import $$observable from 'symbol-observable'

const plugin = (epic) => store => {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof epic !== 'function') {
      throw new TypeError('epic must be a function that receives an observable and returns and observable.')
    }
  }

  const observable = {
    subscribe (observer) {
      const dispatch = store.dispatch
      let live = true

      store.dispatch = (action) => {
        console.log('A', action)
        dispatch(action)

        if (live) {
          observer.next(action)
        }
      }

      const unsubscribe = () => {
        live = false
      }

      return {unsubscribe}
    },

    [$$observable] () {
      return this
    }
  }

  epic(observable, store).subscribe({
    next: (action) => store.dispatch(action)
  })
}

export default plugin
