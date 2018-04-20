import effectsPlugin from './effects'
import {queueEffect} from './online/reducer'
import createNetworkSensor from './online/createNetworkSensor'

const plugin = (opts) => (store) => {
  if (!store.effects) {
    effectsPlugin(store)
  }

  const {
    sensor = createNetworkSensor()
  } = opts || {}

  const startProcessingQueue = () => {

  }

  const stopProcessingQueue = () => {

  }

  sensor.onchange = (isOnline) => {
    if (isOnline) startProcessingQueue()
    else stopProcessingQueue()
  }

  store.effects.whenOnline = (effect) => store.createEffect({
    effect,
    type: 'O'
  })

  store.effectMap.O = ({effect}) => {
    store.dispatch(queueEffect(effect))
  }
}

export default plugin
