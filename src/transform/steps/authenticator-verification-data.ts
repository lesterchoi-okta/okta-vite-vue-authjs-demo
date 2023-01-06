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

import { ControlElement, Layout } from '@jsonforms/core';
import { IdxAuthenticator } from '@okta/okta-auth-js';

import { FormBag, Markdown } from '../../types';
import { transformStepBase } from '../transform-step-base';
import { AuthenticatorKey, StepName, StepTransformer } from '../types';

export const name: StepName = 'authenticator-verification-data';

interface PhoneAuthenticator extends IdxAuthenticator {
  key: 'phone_number';
  methods: { type: 'sms' | 'voice' }[];
  profile: { phoneNumber: string; };
  canResend: boolean;
}

export const map = new Map<AuthenticatorKey, StepTransformer>([
  [
    'phone_number',
    (step, { transaction }) => {
      const authenticator = step.authenticator as PhoneAuthenticator;
      const { schema, data } = transformStepBase(step, { transaction });
      const uischema: Layout = {
        type: 'VerticalLayout',
        elements: [
          {
            type: 'Markdown',
            content: '**Verify with your phone**',
          } as Markdown,
          {
            type: 'Markdown',
            content: `Send a code via ${authenticator.methods[0].type} to ${authenticator.profile.phoneNumber}`,
          } as Markdown,
          {
            type: 'Markdown',
            content: 'Carrier messaging charges may apply',
          } as Markdown,
          {
            type: 'Control',
            scope: '#/properties/methodType',
            options: {
              hidden: true,
              attrs: {},
            },
          } as ControlElement,
        ],
      };

      return { schema, uischema, data } as FormBag;
    },
  ],
]);
