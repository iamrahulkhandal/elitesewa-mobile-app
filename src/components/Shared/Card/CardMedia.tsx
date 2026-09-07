import React from 'react';
import {Image, View, StyleSheet} from 'react-native';
import type {ImageSourcePropType} from 'react-native';
import {sizes} from '../../../constants/theme';

type CardMediaProps = {
  source: ImageSourcePropType;
  borderBottomRadius?: boolean;
};

const CardMedia = ({source, borderBottomRadius = false}: CardMediaProps) => {
  return (
    <View
      style={[
        styles.media,
        borderBottomRadius ? styles.borderBottomRadius : null,
      ]}>
      <Image style={styles.image} source={source} />
    </View>
  ); 
};

const styles = StyleSheet.create({
  media: {
    flex: 1,
    borderTopLeftRadius: sizes.radius,
    borderTopRightRadius: sizes.radius,
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  borderBottomRadius: {
    borderBottomLeftRadius: sizes.radius,
    borderBottomRightRadius: sizes.radius,
  },
});

export default CardMedia;
