const subscribe = () => store => {
  store.subscribe = listener => {
    store.listeners.push(listener)

    const unsubscribe = () => {
      store.listeners = store.listeners.filter(l => l !== listener)
    }

    return unsubscribe
  }
}

export default subscribe
