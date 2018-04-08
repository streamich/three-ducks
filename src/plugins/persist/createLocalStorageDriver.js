const createLocalStorageDriver = (key = '@@persist') => {
  const driver = {
    set: (string) => new Promise((resolve, reject) => {
      try {
        window.localStorage[key] = string
        resolve()
      } catch (error) {
        reject(error)
      }
    }),

    get: () => new Promise((resolve, reject) => {
      try {
        resolve(window.localStorage[key])
      } catch (error) {
        reject(error)
      }
    }),

    delete: () => new Promise((resolve, reject) => {
      try {
        delete window.localStorage[key]
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  return driver
}

export default createLocalStorageDriver
