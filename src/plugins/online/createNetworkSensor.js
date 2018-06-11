const nextCycle = (callback) => setTimeout(callback, 20)

const createNetworkSensor = () => (listener) => {
  const sensor = {
    get onLine () {
      return navigator.onLine
    },

    onchange: () => {}
  }

  window.addEventListener('online', () => nextCycle(() => sensor.onchange(true)))
  window.addEventListener('offline', () => nextCycle(() => sensor.onchange(false)))

  return sensor
}

export default createNetworkSensor
