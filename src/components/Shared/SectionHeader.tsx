import React from 'react';
import type {StyleProp, ViewStyle, TextStyle} from 'react-native';
import {Button, Text, View, StyleSheet} from 'react-native';
import {sizes, spacing} from '../../constants/theme';

type SectionHeaderProps = {
  title: string;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  /** The action button is only rendered when this is supplied. */
  onPress?: () => void;
  buttonTitle?: string;
};

const SectionHeader = ({
  title,
  containerStyle,
  titleStyle,
  onPress,
  buttonTitle = 'Button',
}: SectionHeaderProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {onPress && <Button title={buttonTitle} onPress={onPress} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: spacing.l,
    marginRight: spacing.m,
    marginTop: spacing.l,
    marginBottom: 10,
  },
  title: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
  },
});

export default SectionHeader;
