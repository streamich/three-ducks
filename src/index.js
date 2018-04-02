const createStore = (state, plugins) => {
    const store = {state};

    for (const plugin of plugins)
        plugin(store);

    return store;
};

const pluginActions = () => (store) => {
    store.actions = {};
};

const pluginDispatch = () => (store) => {
    store.middlewares = [];
    store.dispatch = (action) => {
        let result;

        for (const middleware of store.middlewares) {
            result = middleware(action, store);

            if (result !== undefined)
                return result;
        }
    };
};

const pluginReducer = (reducer) => (store) => {
    store.reducer = reducer;
    store.listeners = [];
    store.middlewares.push((action, store) => {
        if (!action) return;

        const oldState = store.state;

        store.state = reducer(oldState, action);

        const stateChanged = store.state !== oldState;

        if (stateChanged)
            for (const listener of store.listeners)
                listener(store, oldState);
    });
};

const pluginThunk = () => (store) => {

};

const pluginSubscribe = () => (store) => {
    store.subscribe = (listener) => {
        store.listeners.push(listener);

        const unsubscribe = () => {
            store.listeners = store.listeners.filter(l => l !== listener);
        };

        return unsubscribe;
    };
};

const pluginGetState = () => (store) => {
    store.getState = () => store.state;
};

const pluginReplaceReducer = () => (store) => {
    store.replaceReducer = (nextReducer) => {
        store.reducer = nextReducer;
    };
};

const plugins = [
    pluginActions(),
    pluginDispatch(),
    pluginReducer(reducer),
    pluginThunk(),
    pluginGetState(),
    pluginSubscribe(),
    pluginReplaceReducer(),
];

const store = createStore({}, plugins);
