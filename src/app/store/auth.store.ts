import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { AuthService } from './auth.service';
import { computed, inject } from '@angular/core';
import { debounceTime, pipe, switchMap, tap } from 'rxjs';
import { AuthRequest } from './auth-request.interface';
import { AuthSuccessResponse } from './auth-success-response.interface';
import { AuthErrorResponse } from './auth-error-response.interface';
import { HttpErrorResponse } from '@angular/common/http';

type AuthState = {
  email: string | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  email: null,
  isLoading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ isLoading, error }) => ({
    isInvalid: computed(() => !isLoading() && !!error()),
  })),
  withMethods((store, authService = inject(AuthService)) => ({
    login: rxMethod<AuthRequest>(
      pipe(
        tap(() =>
          patchState(store, { error: initialState.error, isLoading: true })
        ),
        debounceTime(3000),
        switchMap((payload) =>
          authService.login(payload).pipe(
            tapResponse({
              next: (authResponse: AuthSuccessResponse) =>
                patchState(store, {
                  ...initialState,
                  email: authResponse.email,
                }),
              error: (err: HttpErrorResponse) =>
                patchState(store, {
                  ...initialState,
                  error: err.error.message,
                }),
            })
          )
        )
      )
    ),
    logout() {
      patchState(store, (state) => ({
        ...state,
        email: initialState.email,
      }));
    },
  }))
);
