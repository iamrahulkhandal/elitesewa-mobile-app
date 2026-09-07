import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

type Icon2Props = {
  icon: string;
  color?: string;
  onPress?: () => void;
};

const Icon2 = ({onPress, icon ,color}: Icon2Props) => {
  const iconname = (
    <Icon name={icon} size={24} color={color}/>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{iconname}</TouchableOpacity>;
  }
  return iconname;
};

export default Icon2;
