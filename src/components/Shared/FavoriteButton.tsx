import React from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import {TouchableOpacity, View} from 'react-native';
import {colors, shadow, sizes} from '../../constants/theme';
import Icon from './Icon';

type FavoriteButtonProps = {
  active?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const FavoriteButton = ({active, style, onPress}: FavoriteButtonProps) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <View
        style={[
          {
            backgroundColor: colors.white,
            padding: 4,
            borderRadius: sizes.radius,
          },
          shadow.light,
        ]}>
        <Icon icon={active ? 'FavoriteFilled' : 'Favorite'} size={24} />
      </View>
    </TouchableOpacity>
  );
};

export default FavoriteButton;
