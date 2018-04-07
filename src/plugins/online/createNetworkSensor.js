const nextCycle = window.requestAnimationFrame || setTimeout

const createNetworkSensor = () => (listener) => {
  window.addEventListener('online', () => nextCycle(() => listener(true)))
  window.addEventListener('offline', () => nextCycle(() => listener(true)))
}

export default createNetworkSensor
