export const createStore = (state, plugins) => {
  const store = {state};

  for (const plugin of plugins) plugin(store);

  return store;
};
