import type { AppNavigation, AppRoute } from './navigation';
import type { FieldErrors } from './models';

/**
 * Shared prop shapes.
 *
 * Several of these are `any` on purpose rather than by neglect: the form
 * builders pass a free-form draft object around, and the list rows render
 * whatever the API returned. Naming them here means there is one place to
 * tighten when the server contract is pinned down, instead of `any` scattered
 * across sixty components.
 */

/** What React Navigation injects into a component registered as a screen. */
export type ScreenProps = {
  navigation: AppNavigation;
  route: AppRoute;
};

/** A screen that only uses navigation. */
export type NavigationProps = {
  navigation: AppNavigation;
};

/** The argument FlatList/SectionList hands to renderItem. */
export type RenderItem<T = any> = {
  item: T;
  index?: number;
};

/**
 * One section of the multi-step service form. `formData` is the in-progress
 * draft, which changes shape as steps are added.
 */
export type FormSectionProps = {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: FieldErrors;
};
