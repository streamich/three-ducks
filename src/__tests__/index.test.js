import {createStore} from '..';

describe('index', () => {
    describe('createStore()', () => {
        it('exists', () => {
            expect(typeof createStore).toBe('function');
        });
    });
});
