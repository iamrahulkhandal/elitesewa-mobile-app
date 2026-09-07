import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {sizes, spacing} from '../../constants/theme';

type ScreenHeaderProps = { mainTitle: any; secondTitle: any };

const ScreenHeader = ({mainTitle, secondTitle}: ScreenHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>{mainTitle}</Text>
      <Text style={styles.secondTitle}>{secondTitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
  },
  mainTitle: {
    fontSize: sizes.title,
    fontWeight: 'bold',
  },
  secondTitle: {
    fontSize: sizes.title,
  },
});

export default ScreenHeader;
