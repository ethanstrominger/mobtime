import { h } from '/vendor/hyperapp.js';
import { checkbox } from '/components/checkbox.js';
import * as actions from '/actions.js';
import { section } from '/components/section.js';

export const toggleSound = props => {
  return h(section, null, [
    h(
      checkbox,
      {
        id: 'enable-sound',
        checked: props.allowSound,
        inputProps: {
          onchange: (_, event) => [actions.SetAllowSound, event.target.checked],
        },
      },
      h('span', { class: 'text-2xl' }, 'Enable timer sounds'),
    ),
  ]);
};
