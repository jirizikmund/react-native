/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule AlertManager
 * @flow
 */
'use strict';

const AlertButton = require('AlertButton');
const Platform = require('Platform');
const React = require('React');
const TextInput = require('TextInput');

if (Platform.OS === 'ios') {
  var RCTAlertManager = require('NativeModules').AlertManager;
} else if (Platform.OS === 'android') {
  var RCTAlertManager = require('NativeModules').DialogManagerAndroid;
}

type AlertType = $Enum<{
  'default': string;
  'plain-text': string;
  'secure-text': string;
  'login-password': string;
}>;

type AlertButtonStyle = $Enum<{
  'default': string;
  'cancel': string;
  'destructive': string;
}>;

type Buttons = Array<{
  text?: string;
  onPress?: ?Function;
  style?: AlertButtonStyle;
}>;

type Button = {
  text: string;
  onPress: Function,
  destructive: boolean,
  cancel: boolean,
};

type Alert = {
  title: string;
  message: string;
  buttons: [Button];
};

/**
 * Launches an alert dialog with the specified title and message.
 *
 * Optionally provide a list of buttons. Tapping any button will fire the
 * respective onPress callback and dismiss the alert. By default, the only
 * button will be an 'OK' button.
 *
 * This is an API that works both on iOS and Android and can show static
 * alerts. To show an alert that prompts the user to enter some information,
 * see `AlertIOS`; entering text in an alert is common on iOS only.
 *
 * ## iOS
 *
 * On iOS you can specify any number of buttons. Each button can optionally
 * specify a style, which is one of 'default', 'cancel' or 'destructive'.
 *
 * ## Android
 *
 * On Android at most three buttons can be specified. Android has a concept
 * of a neutral, negative and a positive button:
 *
 *   - If you specify one button, it will be the 'positive' one (such as 'OK')
 *   - Two buttons mean 'negative', 'positive' (such as 'Cancel', 'OK')
 *   - Three buttons mean 'neutral', 'negative', 'positive' (such as 'Later', 'Cancel', 'OK')
 *
 * ```
 * // Works on both iOS and Android
 * Alert.alert(
 *   'Alert Title',
 *   'My Alert Msg',
 *   [
 *     {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
 *     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
 *     {text: 'OK', onPress: () => console.log('OK Pressed')},
 *   ]
 * )
 * ```
 */
class AlertManager {

  _alertQueue: [Alert];

  constructor() {
    this._alertQueue = [];
  }

  add(alert: Alert) {
    this._alertQueue.push(alert);
    if (this._alertQueue.length === 1) {
      this._showAlertFromElement(alert);
    }
  }

  remove(alert: Alert, dismiss: boolean) {
    const alertIndex = this._alertQueue.indexOf(alert);
    const isDisplayed = alertIndex === 0;
    this._alertQueue.splice(alertIndex, 1);

    if (isDisplayed) {
      if (dismiss) {
        this.dismiss();
      }
      if (this._alertQueue.length > 0) {
        this._showAlertFromElement(this._alertQueue[0]);
      }
    }
  }

  _showAlertFromElement(element) {
    const {props} = element;
    const buttons = [];
    let prompt = false;
    let promptType;
    let initialValue;
    React.Children.forEach(props.children, (child) => {
      if (!child) {
        return;
      }
      switch (child.type) {
        case AlertButton:
          buttons.push({
            text: child.props.text,
            onPress: child.props.onPress,
          });
          break;
        case TextInput:
          if (prompt) {
            // If there is 2 inputs it is a login/password alert.
            promptType = 'login-password';
          } else {
            initialValue = child.props.value;
            promptType = child.props.secureTextEntry ? 'secure-text' : 'plain-text';
          }
          prompt = true;
          break;
        default:
          console.warn('Invalid child passed to `Alert`');
          break;
      }
    });

    if (prompt) {
      this.prompt(props.title, props.message, buttons, promptType, initialValue);
    } else {
      this._alert(props.title, props.message, buttons, props.onDismiss);
    }
  }

  /**
   * Closes the current displayed alert.
   */
  dismiss() {
    // RCTAlertManager.dismiss();
  }

  /**
   * Creates a popup to alert the user. See
   * [Alert](/react-native/docs/alert.html).
   *
   *  - title: string -- The dialog's title.
   *  - message: string -- An optional message that appears above the text input.
   *  - callbackOrButtons -- This optional argument should be either a
   *    single-argument function or an array of buttons. If passed a function,
   *    it will be called when the user taps 'OK'.
   *
   *    If passed an array of button configurations, each button should include
   *    a `text` key, as well as optional `onPress` and `style` keys.
   *    `style` should be one of 'default', 'cancel' or 'destructive'.
   *  - type -- *deprecated, do not use*
   *
   * Example:
   *
   * ```
   * AlertIOS.alert(
   *  'Sync Complete',
   *  'All your data are belong to us.'
   * );
   * ```
   */
  alert(
    title: ?string,
    message?: ?string,
    buttons?: Buttons,
    type?: AlertType,
  ): void {
    if (Platform.OS === 'ios') {
      if (typeof type !== 'undefined') {
        console.warn('Alert.alert() with a 4th "type" parameter is deprecated and will be removed. Use AlertIOS.prompt() instead.');
        this._alertIOS(title, message, buttons, type);
        return;
      }
      this._alertIOS(title, message, buttons);
    } else if (Platform.OS === 'android') {
      this._alertAndroid(title, message, buttons);
    }
  }

  _alert(title, message, buttons, onDismiss) {
    if (Platform.OS === 'ios') {
      this._alertIOS(title, message, buttons);
    } else if (Platform.OS === 'android') {
      this._alertAndroid(title, message, buttons, onDismiss);
    }
  }

  /**
   * Prompt the user to enter some text.
   *
   *  - title: string -- The dialog's title.
   *  - message: string -- An optional message that appears above the text input.
   *  - callbackOrButtons -- This optional argument should be either a
   *    single-argument function or an array of buttons. If passed a function,
   *    it will be called with the prompt's value when the user taps 'OK'.
   *
   *    If passed an array of button configurations, each button should include
   *    a `text` key, as well as optional `onPress` and `style` keys (see example).
   *    `style` should be one of 'default', 'cancel' or 'destructive'.
   *  - type: string -- This configures the text input. One of 'plain-text',
   *    'secure-text' or 'login-password'.
   *  - defaultValue: string -- the default value for the text field.
   *
   * Example with custom buttons:
   * ```
   * Alert.prompt(
   *   'Enter password',
   *   'Enter your password to claim your $1.5B in lottery winnings',
   *   [
   *     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
   *     {text: 'OK', onPress: password => console.log('OK Pressed, password: ' + password)},
   *   ],
   *   'secure-text'
   * );
   * ```
   *
   * Example with the default button and a custom callback:
   * ```
   * AlertIOS.prompt(
   *   'Update username',
   *   null,
   *   text => console.log("Your username is "+text),
   *   null,
   *   'default'
   * )
   * ```
   */
  prompt(
    title: ?string,
    message?: ?string,
    callbackOrButtons?: ?((text: string) => void) | Buttons,
    type?: ?AlertType = 'plain-text',
    defaultValue?: string,
  ): void {
    if (Platform.OS === 'android') {
      console.warn('`prompt` is not supported on Android');
      return;
    }
    if (typeof type === 'function') {
      console.warn(
        'You passed a callback function as the "type" argument to AlertIOS.prompt(). React Native is ' +
        'assuming  you want to use the deprecated AlertIOS.prompt(title, defaultValue, buttons, callback) ' +
        'signature. The current signature is AlertIOS.prompt(title, message, callbackOrButtons, type, defaultValue) ' +
        'and the old syntax will be removed in a future version.');

      var callback = type;
      var defaultValue = message;
      RCTAlertManager.alertWithArgs({
        title: title || undefined,
        type: 'plain-text',
        defaultValue,
      }, (id, value) => {
        callback(value);
      });
      return;
    }

    var callbacks = [];
    var buttons = [];
    var cancelButtonKey;
    var destructiveButtonKey;
    if (typeof callbackOrButtons === 'function') {
      callbacks = [callbackOrButtons];
    }
    else if (callbackOrButtons instanceof Array) {
      callbackOrButtons.forEach((btn, index) => {
        callbacks[index] = btn.onPress;
        if (btn.style === 'cancel') {
          cancelButtonKey = String(index);
        } else if (btn.style === 'destructive') {
          destructiveButtonKey = String(index);
        }
        if (btn.text || index < (callbackOrButtons || []).length - 1) {
          var btnDef = {};
          btnDef[index] = btn.text || '';
          buttons.push(btnDef);
        }
      });
    }

    RCTAlertManager.alertWithArgs({
      title: title || undefined,
      message: message || undefined,
      buttons,
      type: type || undefined,
      defaultValue,
      cancelButtonKey,
      destructiveButtonKey,
    }, (id, value) => {
      var cb = callbacks[id];
      cb && cb(value);
    });
  }

  _alertIOS(
    title: ?string,
    message?: ?string,
    callbackOrButtons?: ?(() => void) | Buttons,
    type?: AlertType,
  ): void {
    if (typeof type !== 'undefined') {
      console.warn('AlertIOS.alert() with a 4th "type" parameter is deprecated and will be removed. Use AlertIOS.prompt() instead.');
      this.prompt(title, message, callbackOrButtons, type);
      return;
    }
    this.prompt(title, message, callbackOrButtons, 'default');
  }

  _alertAndroid(title, message, buttons, onDismiss) {
    var config = {
      title: title || '',
      message: message || '',
    };
    // At most three buttons (neutral, negative, positive). Ignore rest.
    // The text 'OK' should be probably localized. iOS Alert does that in native.
    var validButtons: Buttons = buttons ? buttons.slice(0, 3) : [{text: 'OK'}];
    var buttonPositive = validButtons.pop();
    var buttonNegative = validButtons.pop();
    var buttonNeutral = validButtons.pop();
    if (buttonNeutral) {
      config = {...config, buttonNeutral: buttonNeutral.text || '' };
    }
    if (buttonNegative) {
      config = {...config, buttonNegative: buttonNegative.text || '' };
    }
    if (buttonPositive) {
      config = {...config, buttonPositive: buttonPositive.text || '' };
    }
    RCTAlertManager.showAlert(
      config,
      (errorMessage) => console.warn(message),
      (action, buttonKey) => {
        if (action !== RCTAlertManager.buttonClicked) {
          onDismiss && onDismiss();
          return;
        }
        if (buttonKey === RCTAlertManager.buttonNeutral) {
          buttonNeutral.onPress && buttonNeutral.onPress();
        } else if (buttonKey === RCTAlertManager.buttonNegative) {
          buttonNegative.onPress && buttonNegative.onPress();
        } else if (buttonKey === RCTAlertManager.buttonPositive) {
          buttonPositive.onPress && buttonPositive.onPress();
        }
      }
    );
  }
}

module.exports = AlertManager;
