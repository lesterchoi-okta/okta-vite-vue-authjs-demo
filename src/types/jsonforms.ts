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

import {
  ControlElement,
  GroupLayout,
  JsonSchema,
  UISchemaElement,
} from '@jsonforms/core';
import {
  IdxAuthenticator,
  IdxTransaction,
  NextStep,
} from '@okta/okta-auth-js';
import { InputHTMLAttributes } from 'vue';

import { JSONObject } from './json';

export type FormEnvelope = {
  method?: string;
  href?: string;
  name?: string;
  headers?: Record<string, string>;
};

export type FormBag = {
  schema: JsonSchema;
  uischema: Layout;
  data: JSONObject;
};

export type UIType =
  | 'Categorization'
  | 'Category'
  | 'Control'
  | 'Group'
  | 'HorizontalLayout'
  | 'Markdown'
  | 'VerticalLayout'
  | 'Button'
  | 'Custom';

// discriminated union of UISchemaElement sub-interfaces
export type UISchema =
  | Layout
  | Categorization
  | ControlElement
  | GroupLayout
  | TriggerButton
  | Markdown
  | CustomElement;

type CustomOverride =
  | 'enroll-authenticator:webauthn'
  | 'challenge-authenticator:webauthn';

export interface CustomElement extends UISchemaElement {
  type: 'Custom';
  scope: string;
  options: {
    override: CustomOverride,
    transaction: IdxTransaction,
    step: NextStep,
  }
}

export interface Markdown extends UISchemaElement {
  type: 'Markdown';
  content: string;
}

export interface Category extends UISchemaElement {
  type: 'Category';
  label: string;
  elements: UISchemaElement[];
}

export type CategorizationOptions = {
  //
};

export interface Categorization extends UISchemaElement {
  type: 'Categorization';
  elements: Category[];
  options?: CategorizationOptions; // Record<string, unknown>
}

export type TriggerButtonOptions = {
  //
};
export interface TriggerButton extends UISchemaElement {
  type: 'Button';
  options?: TriggerButtonOptions; // Record<string, unknown>
}

export interface Layout extends UISchemaElement {
  type: 'VerticalLayout' | 'HorizontalLayout';
  elements: Array<UISchema>
}

export type JsonFormsConfig = {
  submit: (json: JSONObject, skipValidation?: boolean) => void
  transaction?: IdxTransaction;

  // jsonforms default configs
  restrict: boolean;
  trim: boolean;
  showUnfocusedDescription: boolean;
  hideRequiredAsterisk: boolean;
};

export type ControlOptions<T extends HTMLElement = HTMLInputElement> = {
  isEnroll?: boolean;
  isVerify?: boolean;
  required?: boolean;
  secret?: boolean;
  type?: string;
  authenticator?: IdxAuthenticator;
  step?: NextStep;
  transaction?: IdxTransaction;
  format?: string;
  attrs?: InputHTMLAttributes;
};

declare module '@jsonforms/core' {
  interface ControlProps {
    config: JsonFormsConfig;
    data?: any;
  }
  export interface ControlElement {
    options: ControlOptions;
  }
}

