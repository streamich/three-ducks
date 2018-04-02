const pluginReducer = reducer => store => {
    store.reducer = reducer;
    store.listeners = [];
    store.middlewares.push((action, store) => {
        if (!action) return;

        const oldState = store.state;

        store.state = reducer(oldState, action);

        const stateChanged = store.state !== oldState;

        if (stateChanged) for (const listener of store.listeners) listener(store, oldState);
    });
};

export default pluginReducer;
