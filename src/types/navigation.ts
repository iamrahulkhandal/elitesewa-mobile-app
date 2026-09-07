import type { NavigationProp, RouteProp } from '@react-navigation/native';

/**
 * Screen name -> route params.
 *
 * Deliberately permissive for now. The app has ~40 screens and enumerating
 * every one of them is a follow-up job, but declaring the map here means
 * `navigation.navigate('Checkout', {...})` type-checks today instead of
 * failing against ParamListBase, and there is a single place to tighten later.
 */
export type RootStackParamList = Record<string, any>;

export type AppNavigation = NavigationProp<RootStackParamList>;
export type AppRoute<Name extends string = string> = RouteProp<RootStackParamList, Name>;
