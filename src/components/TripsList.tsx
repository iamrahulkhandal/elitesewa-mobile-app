import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {colors, sizes, spacing} from '../constants/theme';
import FavoriteButton from './Shared/FavoriteButton';
import {useNavigation} from '@react-navigation/native';
import type { AppNavigation } from '../types/navigation';
// import {SharedElement} from 'react-navigation-shared-element';
import Card from './Shared/Card/Card';
import CardMedia from './Shared/Card/CardMedia';
import CardContent from './Shared/Card/CardContent';

const CARD_WIDTH = sizes.width / 2 - (spacing.l + spacing.l / 2);
const CARD_HEIGHT = 220;

const TripsList = ({list}) => {
  const navigation = useNavigation<AppNavigation>();
  return (
    <View style={styles.container}>
      {list.map((item, index) => {
        return (
          <Card
            key={item.id}
            style={styles.card}
            onPress={() => {
              navigation.navigate('TripDetails', {trip: item});
            }}>
            {/* <SharedElement id={`trip.${item.id}.image`} style={styles.media}> */}
              <CardMedia source={item.image} />
            {/* </SharedElement> */}
            <CardContent style={styles.content}>
              <View style={styles.titleBox}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.location}>{item.location}</Text>
              </View>
              <FavoriteButton />
            </CardContent>
          </Card>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardContainer: {
    marginLeft: spacing.l,
    marginBottom: spacing.l,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginLeft: spacing.l,
    marginBottom: spacing.l,
  },
  media: {
    flex: 1,
  },
  content: {
    paddingRight: spacing.m / 2,
  },
  titleBox: {
    flex: 1,
  },
  title: {
    marginVertical: 4,
    fontSize: sizes.body,
    fontWeight: 'bold',
    color: colors.primary,
  },
  location: {
    fontSize: sizes.body,
    color: colors.lightGray,
  },
});

export default TripsList;
