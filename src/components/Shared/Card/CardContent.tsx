import React from 'react';
import {View, StyleSheet} from 'react-native';
import {spacing} from '../../../constants/theme';

type CardContentProps = { children: any; style: any };

const CardContent = ({children, style}: CardContentProps) => {
  return <View style={[styles.content, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.l / 2,
  },
});

export default CardContent;
