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
  OktaAuth,
  OktaAuthOptions,
} from '@okta/okta-auth-js';

export type OktaWidgetProps = Partial<OktaSignInOptions> & {
  stateHandle?: string;
};

/**
 * Basic AuthJS options that can be set as top level properties in OktaSignIn.
 * Values in the authParams object will take precedence.
 */
type PassThruOktaAuthOptions = Pick<OktaAuthOptions,
| 'issuer'
| 'clientId'
| 'redirectUri'
| 'state'
| 'scopes'
| 'flow'
| 'codeChallenge'
| 'codeChallengeMethod'
| 'recoveryToken'
| 'responseType'
>;

export type OktaSignInOptions = PassThruOktaAuthOptions & {
  authParams?: OktaAuthOptions; // configs passed to authjs sdk
  authClient?: OktaAuth; // instance of authjs

  el?: string;
  baseUrl?: string;
  brandName?: string;
  logo?: string;
  logoText?: string;
  stateToken?: string;
  username?: string;
  signOutLink?: string;
  consent?: {
    cancel: { (): void };
  };
  authScheme?: string;
  relayState?: string;
  proxyIdxResponse?: ProxyIdxResponse;
  overrideExistingStateToken?: boolean;
  interstitialBeforeLoginRedirect?: { (): void } | string;
  idpDiscovery?: {
    requestContext?: string;
  };
  assets?: {
    baseUrl: string;
  };
  // i18n?: i18n;
  piv?: {
    certAuthUrl?: string;
    isCustomDomain?: boolean;
    text?: string;
    className?: string;
  };
  customButtons?: CustomButton[];
  features?: OktaWidgetFeatures;
  language?: OktaLanguageCode | string;
  helpSupportNumber?: string;
  helpLinks?: {
    custom?: CustomLink[];
    factorPage: Record<string, string>
  } & Record<string, string>;
};

export type IdxMethod =
  | 'authenticate'
  | 'recoverPassword'
  | 'register'
  | 'poll';

export type OktaThemeOptions = {
  primaryColor: string;
  secondaryColor: string;
  primaryContrastColor: string;
  secondaryContrastColor: string;
  faviconURL: string;
  backgroundColor?: string;
};

export type OktaWidgetFeatures = {
  router?: boolean;
  securityImage?: boolean;
  rememberMe?: boolean;
  autoPush?: boolean;
  webauthn?: boolean;
  smsRecovery?: boolean;
  callRecovery?: boolean;
  emailRecovery?: boolean;
  selfServiceUnlock?: boolean;
  multiOptionalFactorEnroll?: boolean;
  deviceFingerprinting?: boolean;
  useDeviceFingerprintForSecurityImage?: boolean;
  trackTypingPattern?: boolean;
  hideSignOutLinkInMFA?: boolean;
  hideBackToSignInForReset?: boolean;
  rememberMyUsernameOnOIE?: boolean;
  engFastpassMultipleAccounts?: boolean;
  customExpiredPassword?: boolean;
  idpDiscovery?: boolean;
  passwordlessAuth?: boolean;
  consent?: boolean;
  skipIdpFactorVerificationBtn?: boolean;
  showPasswordToggleOnSignInPage?: boolean;
  showIdentifier?: boolean;
  registration?: boolean;
  redirectByFormSubmit?: boolean;
  restrictRedirectToForeground?: boolean;
  showPasswordRequirementsAsHtmlList?: boolean;
};

interface ProxyIdxResponse {
  type: 'object',
  value: {
    name: string,
    platform: string,
    enrollmentLink: string,
    vendor: string,
    signInUrl: string,
    orgName: string,
    challengeMethod: string,
  }
}

type OktaLanguageCode =
  | 'cs' // - Czech
  | 'da' // - Danish
  | 'de' // - German
  | 'el' // - Greek
  | 'en' // - English
  | 'es' // - Spanish
  | 'fi' // - Finnish
  | 'fr' // - French
  | 'hu' // - Hungarian
  | 'id' // - Indonesian
  | 'it' // - Italian
  | 'ja' // - Japanese
  | 'ko' // - Korean
  | 'ms' // - Malaysian
  | 'nb' // - Norwegian
  | 'nl-NL' // - Dutch
  | 'pl' // - Polish
  | 'pt-BR' // - Portuguese (Brazil)
  | 'ro' // - Romanian
  | 'ru' // - Russian
  | 'sv' // - Swedish
  | 'th' // - Thai
  | 'tr' // - Turkish
  | 'uk' // - Ukrainian
  | 'zh-CN' // - Chinese (PRC)
  | 'zh-TW'; // - Chinese (Taiwan)

type CustomButton = {
  title: string;
  className: string;
  click: { (): void }
};

type CustomLink = {
  text: string;
  href: string;
};
