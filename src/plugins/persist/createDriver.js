const createDriver = (key = '@@persist') => {
  const driver = {
    set: (string) => new Promise(resolve => {
      localStorage[key] = string // eslint-disable-line
      resolve()
    }),

    // eslint-disable-next-line
    get: () => new Promise(resolve => resolve(localStorage[key])),

    delete: () => new Promise(resolve => {
      localStorage[key] // eslint-disable-line
      resolve()
    })
  }

  return driver
}

export default createDriver
