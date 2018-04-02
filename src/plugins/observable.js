import $$observable from 'symbol-observable'

const observablePlugin = () => (store) => {
  function observable () {
    const outerSubscribe = store.subscribe

    return {
      subscribe (observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.')
        }

        function observeState () {
          if (observer.next) {
            observer.next(store.getState())
          }
        }

        observeState()
        return {unsubscribe: outerSubscribe(observeState)}
      },

      [$$observable] () {
        return this
      }
    }
  }

  store[$$observable] = observable
}

export default observablePlugin
