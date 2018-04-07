import createDriver from './persist/createDriver'

const plugin = opts => store => {
  if (typeof window !== 'object') {
    return
  }

  const {
    driver = createDriver(),
    filter = state => state,
    stringify = JSON.stringify
  } = opts || {}

  store.persist = () =>
    driver.set(stringify(filter(store.state)))

  store.load = async () => {
    store.state = await driver.get()
  }
}

export default plugin
