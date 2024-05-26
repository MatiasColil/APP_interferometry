/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { enableScreens } from 'react-native-screens';

import { enableFreeze } from 'react-native-screens';

enableFreeze(true);
enableScreens();

AppRegistry.registerComponent(appName, () => App);
