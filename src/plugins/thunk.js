const plugin = () => store => {
  store.middlewares.push((action, store) => {
    if (typeof action === 'function') {
      const result = action(store)
      const isAction = typeof result === 'object'

      // Stop looping through middleware if thunk did not return an action.
      return isAction ? result : false
    }
  })
}

export default plugin
