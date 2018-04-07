const createLocalStorageDriver = (key = '@@persist') => {
  const driver = {
    set: async (string) => {
      window.localStorage[key] = string
    },

    get: async () => window.localStorage[key],

    delete: async () => {
      delete window.localStorage[key]
    }
  }

  return driver
}

export default createLocalStorageDriver
