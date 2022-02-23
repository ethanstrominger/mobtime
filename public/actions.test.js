import test from 'ava';
import * as Actions from './actions.js';

test('SetSound sets sound', t => {
  const storage = {
    getItem: () => null,
    setItem: () => {},
  };
  const originalState = {
    timerId: 'test',
    externals: {
      documentElement: {},
      Notification: {},
      // documentElement: window.document,
      // Notification: window.Notification,
      storage,
      // location: window.location,
      // history: window.history,
      // socketEmitter: Emitter.make(),
    },
  };
  const [state] = Actions.SetAllowSound(originalState, true);

  t.deepEqual(state, {
    ...originalState,
    allowSound: true,
  });
});
