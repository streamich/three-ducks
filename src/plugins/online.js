import effectsPlugin from './effects'

const sym = (name) => `@@online/${name}`

const QUEUE_EFFECT = sym('QUEUE_EFFECT')

const queueEffect = (effect) => ({
  effect,
  type: QUEUE_EFFECT
})

const plugin = () => (store) => {
  if (!store.effects) {
    effectsPlugin(store)
  }

  store.effects.whenOnline = (effect) => queueEffect(effect)
}

export default plugin
