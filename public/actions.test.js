import test from 'ava';
import * as Actions from './actions.js';

test('SetAllowSound turns sound on when off', t => {
  // Setup
  const originalSetting = false;
  const newSetting = true;
  const originalState = { allowSound: originalSetting };

  // Action
  const [state] = Actions.SetAllowSound(originalState, newSetting);

  // Assertion
  const expectedSetting = { ...originalState, allowSound: newSetting };
  t.deepEqual(state, expectedSetting);
});

test('SetAllowSound turns sound off when on', t => {
  // Setup
  const originalSetting = true;
  const newSetting = false;
  const originalState = { allowSound: originalSetting };

  // Action
  const [state] = Actions.SetAllowSound(originalState, newSetting);

  // Assertion
  const expectedSetting = { ...originalState, allowSound: newSetting };
  t.deepEqual(state, expectedSetting);
});
