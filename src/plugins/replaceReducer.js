const replaceReducer = () => store => {
  store.replaceReducer = nextReducer => {
    store.reducer = nextReducer
  }
}

export default replaceReducer
