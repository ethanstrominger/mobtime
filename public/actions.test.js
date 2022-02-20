import test from 'ava';
import * as Actions from './actions.js';

test('SetSound sets sound', t => {
  const originalState = {
    allowSound: false,
  };
  const [state] = Actions.SetAllowSound(originalState, true);

  t.deepEqual(state, {
    ...originalState,
    allowSound: true,
  });
});
