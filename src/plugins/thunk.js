const thunk = () => store => {
  store.middlewares.push((action, store) => {
    if (typeof action === 'function') {
      return action(store)
    }
  })
}

export default thunk
