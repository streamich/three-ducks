const pluginReplaceReducer = () => store => {
  store.replaceReducer = nextReducer => {
    store.reducer = nextReducer;
  };
};

export default pluginReplaceReducer;
