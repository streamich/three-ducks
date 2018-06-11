import createLocalStorageDriver from './persist/createLocalStorageDriver'

const plugin = opts => store => {
  if (typeof window !== 'object') {
    return
  }

  const {
    driver = createLocalStorageDriver(),
    filter = state => state,
    stringify = JSON.stringify,
    parse = JSON.parse
  } = opts || {}

  store.save = () =>
    driver.set(stringify(filter(store.state)))

  store.load = () => {
    driver.get().then((str) => {
      store.state = parse(str)
      return str
    })
  }

  store.clean = driver.delete
}

export default plugin
