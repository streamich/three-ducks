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

  store.load = async () => {
    store.state = parse(await driver.get())
  }

  store.clean = driver.delete
}

export default plugin
