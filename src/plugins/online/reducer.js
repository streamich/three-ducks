import {sym} from './util'

const ENQUEUE = sym('ENQUEUE')

export const queueEffect = (effect) => ({
  effect,
  type: ENQUEUE
})

export const reducer = (state, action) => {
  switch (action.type) {
    case ENQUEUE:
      return {
        ...state,
        effects: [
          ...state.effects,
          action.effect
        ]
      }
    case ENQUEUE:
      return {
        ...state,
        effects
      }
    default:
      return state
  }
}
