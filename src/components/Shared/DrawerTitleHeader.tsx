import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
//import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from './Icon';
import {sizes, spacing} from '../../constants/theme';

const DrawerTitleHeader = ({title}) => {
  //const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, {marginTop: 10}]}>
      <Icon icon="Hamburger" onPress={() => {}} />
      <Text style={styles.title}>{title}</Text>
      <Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({ 
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical:10,
    shadowColor:'black'
  },
  title: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
  },
});

export default DrawerTitleHeader;
