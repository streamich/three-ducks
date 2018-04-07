const plugin = () => store => {
  if (typeof window !== 'object') {
    return
  }

  store.load()

  window.addEventListener('beforeunload', () => {
    store.save()
  })
}

export default plugin
