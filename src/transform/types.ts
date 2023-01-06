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
import { IdxTransaction, Input, NextStep } from '@okta/okta-auth-js';
import { IdxOption } from '@okta/okta-auth-js/lib/idx/types/idx-js';

import { FormBag, JSONObject } from '../types';

export type TransactionTransformer = {
  (
    transaction: IdxTransaction
  ): FormBag;
};

export type StepTransformer = {
  (
    step: NextStep,
    parents: {
      transaction: IdxTransaction
    }
  ): FormBag
};

export type FieldTransformer = {
  (
    field: Input,
    args: {
      path: string[],
      schema: JsonSchema,
      uischema: Layout,
      data: JSONObject,
      options?: IdxOption[],
      transaction: IdxTransaction,
      step: NextStep,
    },
  ): void;
};

export type StepName =
  | 'authenticator-enrollment-data'
  | 'authenticator-verification-data'
  | 'cancel-transaction'
  | 'challenge-authenticator'
  | 'challenge-poll'
  | 'admin-consent'
  | 'email-challenge-consent'
  | 'consent'
  | 'device-apple-sso-extension'
  | 'device-challenge-poll'
  | 'device-enrollment-terminal'
  | 'enroll-authenticator'
  | 'enroll-poll'
  | 'profile-update'
  | 'enroll-profile'
  | 'enrollment-channel-data'
  | 'failure-redirect'
  | 'identify-recovery'
  | 'identify'
  | 'launch-authenticator'
  | 'piv-idp'
  | 'poll'
  | 'redirect-idp'
  | 'reenroll-authenticator-warning'
  | 'reenroll-authenticator'
  | 'request-activation-email'
  | 'resend'
  | 'reset-authenticator'
  | 'select-authenticator-authenticate'
  | 'select-authenticator-enroll-data'
  | 'select-authenticator-enroll'
  | 'select-authenticator-unlock-account'
  | 'select-enroll-profile'
  | 'select-enrollment-channel'
  | 'select-identify'
  | 'skip'
  | 'success-redirect'
  | 'terminal'
  | 'unlock-account'
  | 'user-code';

export type AuthenticatorKey =
  | 'custom_app'
  | 'custom_otp'
  | 'duo'
  | 'okta_email'
  | 'google_otp'
  | 'external_idp'
  | 'onprem_mfa'
  | 'okta_verify'
  | 'okta_password'
  | 'phone_number'
  | 'rsa_token'
  | 'security_question'
  | 'symantec_vip'
  | 'webauthn'
  | 'yubikey_token';
