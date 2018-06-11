const plugin = (type = '@@INIT-1.2.3') => store => {
  store.dispatch({type})
}

export default plugin
