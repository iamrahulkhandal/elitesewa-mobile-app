import React from 'react';
import type {StyleProp, ImageStyle} from 'react-native';
import {Image, TouchableOpacity} from 'react-native';
import icons from '../../constants/icons';

type IconProps = {
  icon: string;
  size?: number;
  style?: StyleProp<ImageStyle>;
  /** Rendered as a plain Image when omitted, rather than a touchable. */
  onPress?: () => void;
};

const Icon = ({onPress, icon, style, size = 32}: IconProps) => {
  const image = (
    <Image
      source={icons[icon]}
      style={[{width: size, height: size, resizeMode: 'cover'}, style]}
    />
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{image}</TouchableOpacity>;
  }
  return image;
};

export default Icon;
