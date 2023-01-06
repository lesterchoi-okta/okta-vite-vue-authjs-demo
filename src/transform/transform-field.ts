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
import { Input } from '@okta/okta-auth-js';
import { IdxOption } from '@okta/okta-auth-js/lib/idx/types/idx-js';
import { set, uniqBy } from 'lodash-es';
import { ControlOptions } from 'src/types';

import { getFieldAttributes } from './get-field-attributes';
import { FieldTransformer } from './types';

const getValue = (option: IdxOption): unknown => {
  if (option.relatesTo) {
    // use reference key
    return option.relatesTo.key;
  }
  return 'value' in option ? option.value : option;
};

export const transformField: FieldTransformer = (input: Input, {
  path,
  schema,
  uischema,
  data,
  transaction,
  step,
}) => {
  // field type
  set(schema, [...path, input.name], { type: input.type || 'string' });

  // add it to schema.required
  if (input.required) {
    schema.required?.push(input.name);
  }

  // add it to data[fieldname]
  if ('value' in input) {
    set(data, input.name, input.value);
  }

  // handle enums
  if (Array.isArray(input.options)) {
    // https://jsonforms.io/docs/labels#oneof-enum-titles
    set(schema, [...path, input.name, 'oneOf'], uniqBy(
      input.options.map((option) => ({
        const: getValue(option),
        title: option.label,
        // info: option, // FIXME throws error in strict mode
      })),
      'const',
    ));

    // select the option if it's the only one available
    if (input.options.length === 1) {
      set(data, input.name, getValue(input.options[0]));
    }
  }
  if (input.type === 'object') {
    const layout: Layout = {
      type: 'VerticalLayout',
      elements: [],
    };

    // @ts-ignore Input missing form
    input.form?.value.forEach((subField: Input) => {
      // recurse
      transformField(subField, {
        schema: set(schema, [...path, input.name, 'properties'], {}),
        uischema: layout,
        data: {},
        path: [...path, input.name, 'properties'],
        transaction,
        step,
      });
    });
    uischema.elements.push(layout);
  } else {
    const ctrl: ControlElement & {
      options: ControlOptions;
    } = {
      type: 'Control',
      label: input.label,
      scope: ['#', ...path, input.name].join('/'),
      options: {
        ...getFieldAttributes(input),
        authenticator: step.authenticator,
      },
    };
    uischema.elements.push(ctrl);
  }
};
