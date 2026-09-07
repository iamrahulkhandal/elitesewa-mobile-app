import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from './store';

/**
 * Typed replacements for the bare react-redux hooks. `useAppDispatch` knows
 * about the thunk middleware, so dispatching a thunk type-checks; and
 * `useAppSelector` knows the state shape, so `state.auth` resolves instead of
 * coming back as `unknown`.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
