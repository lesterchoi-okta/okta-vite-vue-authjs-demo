/*
 * Copyright (c) 2022-present, Okta, Inc. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant
 * to the Apache License, Version 2.0 (the "License.")
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Input } from '@okta/okta-auth-js';
import { InputHTMLAttributes } from 'vue';
import { ControlOptions } from '../types';

export const map = new Map<string, InputHTMLAttributes>([
  ['identifier', {
    type: 'username',
    autocomplete: 'username',
  }],
  ['username', {
    type: 'username',
    autocomplete: 'username',
  }],
  ['passcode', {
    // type: 'password', // NOTE: interferes with visibility toggle
    autocomplete: 'current-password',
    autocorrect: 'off',
    autocapitalize: 'off',
    spellcheck: false,
  }],
  ['password', {
    // type: 'password', // NOTE: interferes with visibility toggle
    autocomplete: 'current-password',
    autocorrect: 'off',
    autocapitalize: 'off',
    spellcheck: false,
  }],
  ['verificationCode', {
    autocomplete: 'off', // FIXME one-time-code
    autocorrect: 'off',
    autocapitalize: 'off',
    spellcheck: false,
  }],
]);

/**
 * Get the "options" property to use in the uischema ControlElement.
 * @param input get the options for a field
 * @returns options
 */
export const getFieldAttributes = (input: Input): ControlOptions => {
  const options: ControlOptions = { attrs: {} };

  // NOTE: for a "string" property within an object, "required" only validates
  // that the key is set, it does NOT enforce minLength of the string.
  if (input.required) {
    options.required = true;
  }

  if (input.secret) {
    options.secret = true;
    options.type = 'password';
  }

  const attrs = map.get(input.name);
  if (attrs) {
    options.attrs = attrs;
  }

  return options;
};
