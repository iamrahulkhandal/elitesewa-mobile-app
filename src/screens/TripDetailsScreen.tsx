import React from 'react';
import type { AppNavigation, AppRoute } from '../types/navigation';
import {View, StyleSheet} from 'react-native';
import {colors, sizes, spacing} from '../constants/theme';
import Icon from '../components/Shared/Icon';
//import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import TripDetailsCard from '../components/TripDetailsCard/TripDetailsCard';
import * as Animatable from 'react-native-animatable';
import TripDetailsCarousel from '../components/TripDetailsCarousel';
import FavoriteButton from '../components/Shared/FavoriteButton';

type TripDetailsScreenProps = { navigation: AppNavigation; route: AppRoute };

const TripDetailsScreen = ({navigation, route}: TripDetailsScreenProps) => {
  //const insets = useSafeAreaInsets();
  const {trip} = route.params ?? {};
  const slides = [trip.image, ...trip.gallery];
  return (
    <View style={styles.container}>
      <Animatable.View
        style={[styles.backButton, {marginTop: 100}]}
        animation="fadeIn"
        delay={500}
        duration={400}
        easing="ease-in-out">
        <Icon
          icon="ArrowLeft"
          style={styles.backIcon}
          onPress={navigation.goBack}
        />
      </Animatable.View>
      <Animatable.View
        style={[styles.favoriteButton, {marginTop: 100}]}
        animation="fadeIn"
        delay={500}
        duration={400}
        easing="ease-in-out">
        <FavoriteButton onPress={() => {}} />
      </Animatable.View>
      <TripDetailsCarousel slides={slides} id={trip.id} />
      {/* <TripDetailsCard trip={trip} />  */}
    </View>
  );
};

TripDetailsScreen.sharedElements = (route: any) => {
  const {trip} = route.params ?? {};
  return [
    {
      id: `trip.${trip.id}.image`,
    },
  ];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBox: {
    borderRadius: sizes.radius,
    overflow: 'hidden',
  },
  image: {
    width: sizes.width,
    height: sizes.height,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    left: spacing.l,
    zIndex: 1,
  },
  favoriteButton: {
    position: 'absolute',
    right: spacing.l,
    zIndex: 1,
  },
  backIcon: {
    tintColor: colors.white,
  },
});

export default TripDetailsScreen;