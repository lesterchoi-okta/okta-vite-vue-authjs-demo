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

import { JsonSchema, Layout } from '@jsonforms/core';
import { merge } from 'lodash-es';
import { JSONObject } from '../types';

import { createForm } from '../utils/create-form';
import { transformStep } from './transform-step';
import { TransactionTransformer } from './types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mergeUISchema = (source: Layout, ...uischemas: Layout[]): Layout => ({
  ...source,
  elements: source.elements.concat(...uischemas.map(({ elements }) => elements)),
});

export const transformTransaction: TransactionTransformer = (transaction) => {
  console.debug('transformTransaction', {
    transaction,
    nextStep: transaction.nextStep,
    availableSteps: transaction.availableSteps,
  });

  if (transaction.nextStep) {
    return transformStep(transaction.nextStep, { transaction });
  }

  const steps = transaction.availableSteps;
  if (steps) {
    return steps.map((step) => transformStep(step, { transaction }))
      // merge form bags into single
      .reduce((a, b) => ({
        schema: merge<JsonSchema, JsonSchema>(a.schema, b.schema),
        // @ts-ignore uischema type mismatch string vs literal
        uischema: mergeUISchema(a.uischema, b.uischema),
        data: merge<JSONObject, JSONObject>(a.data, b.data),
      }), createForm());
  }
  throw new Error('IDX transaction missing nextStep and availableSteps');
};
