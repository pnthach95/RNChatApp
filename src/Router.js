import React from 'react';
import { StackNavigator } from 'react-navigation';
import {FirstScreen} from './firstScreen.js';
import {Main} from './main.js';

export const Stack = StackNavigator({
  First:{ screen: FirstScreen },
  Chat:{ screen: Main }
})