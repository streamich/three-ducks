import $$observable from 'symbol-observable'

const plugin = (epic) => store => {
  const dispatch = store.dispatch
  const observable = {
    subscribe (observer) {
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
    },

    [$$observable] () {
      return this
    }
  }

  epic(observable, store)(dispatch)
}

export default plugin
