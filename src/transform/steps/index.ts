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

import { AuthenticatorKey, StepTransformer } from '../types';
import * as authenticatorVerificationData from './authenticator-verification-data';
import * as challengeAuthenticator from './challenge-authenticator';
import * as enrollAuthenticator from './enroll-authenticator';
import * as resetAuthenticator from './reset-authenticator';
// import * as selectEnrollProfile from './select-enroll-profile';

export const stepTransformers = new Map<string, Map<AuthenticatorKey, StepTransformer>>([
  [authenticatorVerificationData.name, authenticatorVerificationData.map],
  [challengeAuthenticator.name, challengeAuthenticator.map],
  [enrollAuthenticator.name, enrollAuthenticator.map],
  [resetAuthenticator.name, resetAuthenticator.map],
]);
