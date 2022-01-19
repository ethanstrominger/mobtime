import { effects } from 'ferp';
import { CloseWebsocket, RelayMessage, ShareMessage } from './websocket';
import * as Connection from './connection';
import { id, GenerateIdEffect } from './id';

const { none, act, batch, defer } = effects;

const defaultStatistics = {
  connections: 0,
  mobbers: 0,
};

const defaultTimer = {
  mob: [],
  goals: [],
  settings: {
    mobOrder: 'Navigator,Driver',
    duration: 5 * 60 * 1000,
  },
};

const extractStatistics = message => {
  const { type, ...data } = JSON.parse(message);

  switch (type) {
    case 'mob:update':
      return { mobbers: data.mob.length };
    default:
      return {};
  }
};

export const Init = (queue, nextId = id()) => [
  {
    connections: {},
    queue,
    nextId,
  },
  none(),
];

export const SetNextId = nextId => state => [{ ...state, nextId }, none()];

export const UpdateStatisticsFromMessage = (timerId, message) => state => [
  state,
  defer(
    state.queue
      .mergeStatistics(timerId, stats => ({
        ...defaultStatistics,
        ...stats,
        ...extractStatistics(message),
      }))
      .then(none),
  ),
];

export const SetTimerTTL = (timerId, ttl) => state => [
  state,
  defer(state.queue.setTimerTtl(timerId, ttl)),
];

export const UpdateConnectionStatistics = timerId => state => [
  state,
  defer(resolve => {
    const connections = (state.connections[timerId] || []).length;

    if (connections === 0) {
      return state.queue
        .getStatistics()
        .then(({ [timerId]: oldTimer, ...otherTimers }) => otherTimers)
        .then(stats => state.queue.setStatistics(stats))
        .then(none)
        .then(resolve);
    }

    return state.queue
      .mergeStatistics(timerId, stats => ({
        ...defaultStatistics,
        ...stats,
        connections,
      }))
      .then(none)
      .then(resolve);
  }),
];

export const AddConnection = (websocket, timerId) => state => {
  const connection = Connection.make(state.nextId, websocket, timerId);
  return [
    {
      ...state,
      connections: {
        ...state.connections,
        [timerId]: (state.connections[timerId] || []).concat(connection),
      },
    },
    batch([
      GenerateIdEffect(SetNextId),
      act(UpdateConnectionStatistics(timerId), 'UpdateConnectionStatistics'),
      act(ShareTimerWith(connection, timerId), 'ShareTimerWith'),
      defer(state.queue.setTimerTtl(timerId, -1).then(none), 'setTimerTtl'),
    ]),
  ];
};

export const RemoveConnection = (websocket, timerId) => state => {
  const timerConnections = (state.connections[timerId] || []).filter(
    c => c.websocket !== websocket,
  );
  const { [timerId]: current, ...others } = state.connections;

  return [
    {
      ...state,
      connections:
        timerConnections.length > 0
          ? { ...others, [timerId]: current }
          : others,
    },
    batch([
      CloseWebsocket(websocket),
      act(UpdateConnectionStatistics(timerId), 'UpdateConnectionStatistics'),
      timerConnections.length > 0
        ? none()
        : defer(
            state.queue.setTimerTtl(timerId, 60 * 24 * 3).then(none),
            'setTimerTtl',
          ),
    ]),
  ];
};

export const UpdateTimer = (timerId, message) => state => {
  const { type, ...data } = JSON.parse(message);

  const meta = {
    ...(type === 'timer:start' ? { timerStartedAt: Date.now() } : {}),
    ...(type === 'timer:complete' ? { timerStartedAt: null } : {}),
    ...(type === 'timer:pause' ? { timerStartedAt: null } : {}),
  };

  return [
    state,
    batch([
      defer(
        state.queue
          .mergeTimer(timerId, timer => ({
            ...timer,
            ...data,
            ...meta,
          }))
          .then(none),
      ),
      defer(state.queue.publishToTimer(timerId, message).then(none)),
      act(UpdateStatisticsFromMessage(timerId, message)),
    ]),
  ];
};

export const MessageTimer = (timerId, message) => state => {
  return [
    state,
    ShareMessage(
      timerId,
      state.connections[timerId] || [],
      message,
      state.queue,
    ),
  ];
};

export const ShareTimerWith = (connection, timerId) => state => [
  state,
  effects.defer(
    state.queue.getTimer(timerId).then(timer => {
      if (!timer) return;

      const sync = (key, payload) =>
        RelayMessage(
          connection,
          JSON.stringify(
            payload || {
              type: `${key}:update`,
              [key]: timer[key] || defaultTimer[key],
            },
          ),
        );

      const timerIsRunning =
        timer.timerStartedAt &&
        timer.timerDuration &&
        timer.timerDuration - (Date.now() - timer.timerStartedAt) > 0;

      return batch(
        [
          sync('settings'),
          sync('mob'),
          sync('goals'),
          sync('timer', {
            type: 'timer:update',
            timerStartedAt: timer.timerStartedAt,
            timerDuration: timer.timerDuration,
          }),
        ].filter(Boolean),
      );
    }),
  ),
];
