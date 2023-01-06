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

import { ControlElement } from '@jsonforms/core';
import { UISchema } from 'src/types';

/**
 * Traverse the uischema and find the first element that matches the predicate
 * @param uischema UISchema
 * @param predicate function to determine whether the element matches
 */
export const findControlElement = (
  uischema: UISchema,
  predicate: (el: ControlElement) => boolean,
): ControlElement | undefined => {
  if (uischema.type === 'Control' && predicate(uischema)) {
    return uischema;
  }
  if (uischema.type === 'VerticalLayout' || uischema.type === 'HorizontalLayout') {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < uischema.elements.length; i++) {
      const el = uischema.elements[i];
      return findControlElement(el, predicate);
    }
  }

  // TODO handle category / categorization

  return undefined;
};
