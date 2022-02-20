import test from 'ava';

import * as actions from './actions';
import * as effects from './effects';

test('can complete a timer', t => {
  const socketEmitter = {};
  const documentElement = {};
  const Notification = {};
  const externals = { socketEmitter, documentElement, Notification };
  const initialState = {
    allowNotification: true,
    allowSound: false,
    timerStartedAt: Date.now(),
    timerDuration: 1,
    externals,
  };

  const [state, ...effect] = actions.Completed(initialState, {
    isEndOfTurn: true,
    documentElement,
    Notification,
  });

  t.deepEqual(state, {
    allowNotification: true,
    allowSound: false,
    timerStartedAt: null,
    timerDuration: 0,
    externals,
  });

  t.deepEqual(effect, [
    effects.CompleteTimer({
      socketEmitter,
    }),
    effects.andThen({
      action: actions.EndTurn,
      props: {},
    }),
    effects.andThen({
      action: actions.CycleMob,
      props: {},
    }),
  ]);
});

test('can pause the timer', t => {
  const socketEmitter = {};
  const externals = { socketEmitter };
  const originalWebsocket = {};

  const expectedTimerDuration = 1000;
  const now = Date.now();
  const originalTimerStartedAt = now - expectedTimerDuration;
  const originalCurrentTime = now - 5;

  const initialState = {
    externals,
    timerStartedAt,
    currentTime,
    websocket: originalWebsocket,
    timerStartedAt: originalTimerStartedAt,
    actionTime: originalCurrentTime,
    timerDuration: 2000,
  };

  const [state, effect] = actions.PauseTimer(initialState, now);

  t.deepEqual(state, {
    externals,
    websocket: originalWebsocket,
    timerStartedAt: null,
    actionTime: now,
    timerDuration: expectedTimerDuration,
  });

  t.deepEqual(
    effect,
    effects.PauseTimer({
      socketEmitter,
      websocket: originalWebsocket,
      timerDuration: expectedTimerDuration,
    }),
  );
});

test('can resume the timer', t => {
  const now = Date.now();
  const beforeNow = now - 100000;
  const socketEmitter = {};
  const externals = { socketEmitter };

  const initialState = {
    externals,
    timerStartedAt: beforeNow,
    actionTime: now,
    timerDuration: 1000000,
  };

  const [state, effect] = actions.ResumeTimer(initialState, now);

  t.deepEqual(state, {
    externals,
    timerStartedAt: now,
    actionTime: now,
    timerDuration: 1000000,
  });

  t.deepEqual(
    effect,
    effects.StartTimer({
      socketEmitter,
      timerDuration: 1000000,
    }),
  );
});

test('can start the timer', t => {
  const now = Date.now();
  const socketEmitter = {};
  const externals = { socketEmitter };
  const timerDuration = 10000;

  const initialState = {
    externals,
    settings: {
      duration: timerDuration,
    },
  };

  const [state, effect] = actions.StartTimer(initialState, {
    timerStartedAt: now,
    timerDuration: initialState.settings.duration,
  });

  t.deepEqual(state, {
    externals,
    timerStartedAt: now,
    actionTime: now,
    timerDuration,
    settings: {
      duration: timerDuration,
    },
  });

  t.deepEqual(
    effect,
    effects.StartTimer({
      socketEmitter,
      timerDuration,
    }),
  );
});
