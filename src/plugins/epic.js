const plugin = (epic) => store => {
  const observable = (observer) => {
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

    return unsubscribe
  }

  epic(observable)(store.dispatch)
}

export default plugin
