import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {colors, shadow, sizes} from '../../constants/theme';
import Icon from './Icon';

const FavoriteButton = ({active, style, onPress}) => {
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
