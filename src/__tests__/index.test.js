import {createStore} from '..';

describe('index', () => {
  describe('createStore()', () => {
    it('exists', () => {
      expect(typeof createStore).toBe('function');
    });

    it('expects plugins to be an array of functions', () => {
      let store;

      expect(() => {
        store = createStore();
      }).toThrow();

      expect(() => {
        store = createStore(null);
      }).toThrow();

      expect(() => {
        store = createStore({});
      }).toThrow();

      expect(() => {
        store = createStore({}, 123);
      }).toThrow();

      expect(() => {
        store = createStore({}, []);
      }).not.toThrow();
    });

    it('creates store with initial state', () => {
      const state = {};
      const store = createStore(state, []);

      expect(typeof store).toBe('object');
      expect(store.state).toBe(state);
    });

    it('applies plugins', () => {
      const state = {};
      const plugins = [jest.fn(), jest.fn(), jest.fn()];
      const store = createStore(state, plugins);

      for (const plugin of plugins) {
        expect(plugin).toHaveBeenCalledTimes(1);
        expect(plugin).toHaveBeenCalledWith(store);
      }
    });
  });
});
