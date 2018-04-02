const getState = () => store => {
  store.getState = () => store.state
}

export default getState
