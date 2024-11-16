import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const email = authStore.email();

  if (email !== null) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
