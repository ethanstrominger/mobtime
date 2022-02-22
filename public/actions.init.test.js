import test from 'ava';
import * as actions from './actions';

test('creates a state with timer-related state', t => {
  const state = actions.Init(
    {},
    {
      timerId: 'test',
      externals: {
        documentElement: {},
        Notification: {},
      },
    },
  );
  t.snapshot(state);
});

test('check expected values', t => {
  const state = actions.Init(
    {},
    {
      timerId: 'test',
      externals: {
        documentElement: {},
        Notification: {},
      },
    },
  );
  const { allowSound } = state[0];
  console.log('debug 3b', allowSound, state[0], 'xxxxxxx', state);

  t.assert(allowSound);
});
