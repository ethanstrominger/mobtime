import { h } from '/vendor/hyperapp.js';
import { section } from '/components/section.js';
import { input } from '/components/input.js';
import * as actions from '/actions.js';

const value = (key, { pendingSettings, settings }) =>
  key in pendingSettings ? pendingSettings[key] : settings[key];

export const setDuration = props =>
  h(section, null, [
    h(
      'span',
      {
        class: {
          'mb-3': true,
          'text-2xl': true,
        },
      },
      'Turn Duration (minutes):',
    ),
    h(input, {
      name: 'setDuration',
      maxlength: 4,
      value: value('duration', props),
      oninput: [
        actions.PendingSettingsSet,
        e => ({
          key: 'duration',
          value: e.target.value,
        }),
      ],
      onblur: [actions.UpdateSettings],

      class: {
        'text-4xl': true,
        'font-extrabold': true,
        'hover:border-indigo-300': true,
        'hover:border-b-solid': true,
        'bg-indigo-600': true,
        'text-white': true,
        'w-1/3': true,
        'text-center': true,
      },
    }),
  ]);
