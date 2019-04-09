import React, { Component } from 'react'
import { Text,  View } from 'react-native'
import Recorder from './Recorder'
import Player from './Player'
import ImagePicker from './ImagePicker'
import {createBottomTabNavigator ,createAppContainer } from 'react-navigation';

const TabNavigator =  createBottomTabNavigator({
    Recorder : Recorder,
    Player   : Player ,
    ImagePicker : ImagePicker,
  }, {

  });

export default RootScreen  = createAppContainer(TabNavigator);


