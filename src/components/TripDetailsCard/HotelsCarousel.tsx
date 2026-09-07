import React from 'react';
import Carousel from '../Shared/Carousel';
import {Text, View, StyleSheet} from 'react-native';
import Card from '../Shared/Card/Card';
import CardMedia from '../Shared/Card/CardMedia';
import CardContent from '../Shared/Card/CardContent';
import {colors, sizes, spacing} from '../../constants/theme';
import Icon from '../Shared/Icon';
import Rating from '../Shared/Rating/Rating';
import CardFavoriteIcon from '../Shared/Card/CardFavoriteIcon';

const CARD_HEIGHT = 200;

type HotelsCarouselProps = { hotels: any };

const HotelsCarousel = ({hotels}: HotelsCarouselProps) => {
  return (
    <Carousel
      items={hotels}
      renderItem={({item, style}: { item: any; style: any }) => {
        return (
          <Card style={[styles.card, style]}>
            <CardFavoriteIcon active={false} onPress={() => {}} />
            <CardMedia source={item.image} />
            <CardContent style={styles.content}>
              <View style={styles.titleBox}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.locationBox}>
                  <Text style={styles.location}>{item.location}</Text>
                  <Icon icon="Location" size={18} style={styles.locationIcon} />
                </View>
                <Rating
                  showLabelInline
                  rating={item.rating}
                  size={12}
                  containerStyle={styles.rating}
                />
              </View>
              <View style={styles.priceBox}>
                <Text style={styles.price}>{item.pricePeerDay}</Text>
                <Text style={styles.priceCaption}>peer day</Text>
              </View>
            </CardContent>
          </Card>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
  },
  content: {
    height: 88,
  },
  titleBox: {
    flex: 1,
  },
  title: {
    fontSize: sizes.body,
    fontWeight: 'bold',
    color: colors.primary,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 2,
  },
  location: {
    fontSize: sizes.caption,
    color: colors.lightGray,
  },
  locationIcon: {
    tintColor: colors.gray,
  },
  rating: {
    marginTop: spacing.m / 2,
  },
  priceBox: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  price: {
    fontSize: sizes.body,
    fontWeight: 'bold',
    color: colors.primary,
  },
  priceCaption: {
    fontSize: sizes.caption,
    color: colors.lightGray,
    marginTop: 2,
  },
});

export default HotelsCarousel;
