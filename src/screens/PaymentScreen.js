import React, { useState,useEffect } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { View, Text } from 'react-native';
import YourCheckoutScreen from './YourCheckoutScreen';
import {SP_KEY} from '@env';
const PaymentScreen = ({ route }) => {
    const { price } = route.params;
  return (
    <>
    <StripeProvider
      publishableKey={SP_KEY}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
       {/* <YourCheckoutScreen price={price['price_rate']} /> */}
       <YourCheckoutScreen price={price} />
    </StripeProvider>
    </>
  );
}
export default PaymentScreen;