const plugin = opts => store => {
  if (typeof window !== 'object') {
    return
  }

  const LS = window.localStorage

  const {
    key = '@@persist',
    filter = state => state,
    stringify = JSON.stringify,
    parse = JSON.parse
  } = opts || {}

  store.save = () => {
    try {
      LS[key] = stringify(filter(store.state))
    } catch (error) {}
  }

  store.load = () => {
    try {
      const obj = parse(LS[key])

      if (obj) {
        store.state = obj
      }
    } catch (error) {}
  }

  store.clean = () => {
    try {
      delete LS[key]
    } catch (error) {}
  }
}

export default plugin
