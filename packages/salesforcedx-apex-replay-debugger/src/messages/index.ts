/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {
  BASE_FILE_EXTENSION,
  BASE_FILE_NAME,
  Config,
  DEFAULT_LOCALE,
  Localization,
  Message
} from '@salesforce/salesforcedx-utils-vscode';
import * as i18n from './i18n';
import * as i18nJA from './i18n.ja';

function loadMessageBundle(config?: Config): Message {
  function resolveFileName(locale: string): string {
    return locale === DEFAULT_LOCALE
      ? `${BASE_FILE_NAME}.${BASE_FILE_EXTENSION}`
      : `${BASE_FILE_NAME}.${locale}.${BASE_FILE_EXTENSION}`;
  }

  const base = new Message(i18n.messages);

  if (config && config.locale && config.locale !== DEFAULT_LOCALE) {
    try {
      if (config.locale === 'ja') {
        const layer = new Message(i18nJA.messages, base);
        return layer;
      }
      throw new Error('locale not supported.');
    } catch (e) {
      console.error(`Cannot find ${config.locale}, defaulting to en`);
      return base;
    }
  } else {
    return base;
  }
}

export const nls = new Localization(
  loadMessageBundle(
    process.env.VSCODE_NLS_CONFIG
      ? JSON.parse(process.env.VSCODE_NLS_CONFIG!)
      : undefined
  )
);
