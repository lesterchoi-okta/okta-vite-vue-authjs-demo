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

import { set } from 'lodash-es';

import { Layout } from '../../types';
import { createForm } from '../../utils/create-form';
import { findControlElement } from '../find-control-element';
import { transformStepBase } from '../transform-step-base';
import { AuthenticatorKey, StepName, StepTransformer } from '../types';

export const name: StepName = 'enroll-authenticator';

export const map = new Map<AuthenticatorKey, StepTransformer>([
  [
    'webauthn',
    (step, { transaction }) => {
      const form = createForm();
      form.uischema = {
        type: 'VerticalLayout',
        elements: [
          {
            type: 'Custom',
            scope: '#/properties/credentials',
            options: {
              override: 'enroll-authenticator:webauthn',
              transaction,
              step,
            },
          },
        ],
      } as Layout;
      return form;
    },
  ],
  [
    'okta_password',
    (step, { transaction }) => {
      const { uischema, schema, data } = transformStepBase(step, { transaction });
      const el = findControlElement(uischema, ({ scope }) => (
        scope.endsWith('/password')
      ));
      if (el) {
        el.options.isEnroll = true;
        // TODO move to get-field-attributes
        set(el, 'options.attrs.autocomplete', 'new-password');
      }
      return {
        schema,
        uischema,
        data,
      };
    },
  ],
]);
