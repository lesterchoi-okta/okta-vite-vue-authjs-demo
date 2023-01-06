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

import { IdxTransaction, NextStep } from '@okta/okta-auth-js';
import { IdxRemediationValue } from '@okta/okta-auth-js/lib/idx/types/idx-js';

import { stepTransformers } from './steps';
import { transformStepBase } from './transform-step-base';
import { AuthenticatorKey, StepTransformer } from './types';

const setInputOptions = (step: NextStep, transaction: IdxTransaction) => {
  const fields = new Map<string, IdxRemediationValue>(
    transaction.neededToProceed.find((r) => r.name === step.name)
      ?.value
      ?.map((field) => [field.name, field]),
  );
  step.inputs?.forEach((input) => {
    const options = fields.get(input.name)?.options;
    if (options) {
      // @ts-ignore input should have options
      input.options = options; // eslint-disable-line no-param-reassign
    }
  });
};

export const transformStep: StepTransformer = (step, { transaction }) => {
  const map = stepTransformers.get(step.name);
  const key = step.authenticator?.key;
  console.debug('transformStep', {
    step,
    transaction,
    key,
    map,
  });
  setInputOptions(step, transaction);

  if (key && map) {
    const transform = map.get(key as AuthenticatorKey);
    if (transform) {
      console.debug({ transform });
      return transform(step, { transaction });
    }
  }
  console.debug('using default step transformer');
  return transformStepBase(step, { transaction });
};
