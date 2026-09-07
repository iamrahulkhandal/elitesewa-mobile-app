import React, {forwardRef} from 'react';
import {View} from 'react-native';
import type {StyleProp, ViewStyle} from 'react-native';
import {colors, spacing} from '../../constants/theme';

type DividerProps = {
  style?: StyleProp<ViewStyle>;
  enabledSpacing?: boolean;
};

const Divider = forwardRef<View, DividerProps>(({style, enabledSpacing = true}, ref) => {
  return (
    <View
      ref={ref}
      style={[
        {
          height: 1,
          backgroundColor: colors.lightGray,
          marginHorizontal: enabledSpacing ? spacing.l : 0,
        },
        style,
      ]}
    />
  );
});

export default Divider;
