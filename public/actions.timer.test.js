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
  const expectedTimerDuration = 1000;
  const pausedTime = Date.now();
  const timerStartedAt = pausedTime - expectedTimerDuration;
  const actionTime = pausedTime - 5;

  const initialState = {
    externals,
    timerStartedAt,
    actionTime,
    timerDuration: 2000,
  };

  const [state, effect] = actions.PauseTimer(initialState, pausedTime);

  t.deepEqual(state, {
    externals,
    timerStartedAt: null,
    actionTime: pausedTime,
    timerDuration: expectedTimerDuration,
  });

  t.deepEqual(
    effect,
    effects.PauseTimer({
      socketEmitter,
      timerDuration: expectedTimerDuration,
    }),
  );
});

test('can resume the timer', t => {
  const resumedTime = Date.now();
  const beforeNow = resumedTime - 100000;
  const socketEmitter = {};
  const externals = { socketEmitter };

  const initialState = {
    externals,
    timerStartedAt: beforeNow,
    actionTime: resumedTime,
    timerDuration: 1000000,
  };

  const [state, effect] = actions.ResumeTimer(initialState, resumedTime);

  t.deepEqual(state, {
    externals,
    timerStartedAt: resumedTime,
    actionTime: resumedTime,
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
  const startedTime = Date.now();
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
    timerStartedAt: startedTime,
    timerDuration: initialState.settings.duration,
  });

  t.deepEqual(state, {
    externals,
    timerStartedAt: startedTime,
    actionTime: startedTime,
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
