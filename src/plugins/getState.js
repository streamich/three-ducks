const pluginGetState = () => store => {
  store.getState = () => store.state;
};

export default pluginGetState;
