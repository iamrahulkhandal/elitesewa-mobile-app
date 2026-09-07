import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
//import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon2 from './Icon2';
import {sizes} from '../../constants/theme';

type BackTitleHeaderProps = { title: string; IconLeft: any; IconRight: any; EventLeft: any; EventRight: any; IconColorRight: any; IconColorLeft: any };

const BackTitleHeader = ({title,IconLeft,IconRight,EventLeft,EventRight,IconColorRight,IconColorLeft}: BackTitleHeaderProps) => {
  //const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, {marginTop: 10}]}>
      <Icon2 icon={IconLeft} onPress={EventLeft} color={IconColorLeft}/>
      <Text style={styles.title}>{title}</Text>
      <Icon2 icon={IconRight} onPress={EventRight} color={IconColorRight} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign:'center',
    paddingVertical:10,
    paddingHorizontal:10,
    shadowColor:'black'
  },
  title: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
  },
});

export default BackTitleHeader;
