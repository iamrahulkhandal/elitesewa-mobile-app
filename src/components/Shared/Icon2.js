import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

const Icon2 = ({onPress, icon ,color}) => {
  const iconname = (
    <Icon name={icon} size={24} color={color}/>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{iconname}</TouchableOpacity>;
  }
  return Icon2;
};

export default Icon2;
